import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import TeamMember from '../models/TeamMember.js';
import SystemConfig from '../models/SystemConfig.js';
import LoginAttempt from '../models/LoginAttempt.js';
import { authenticate } from '../middleware/auth.js';
import { sendVerificationEmail } from '../services/emailService.js';
import { validateEmail, validatePassword, validateText, validateFields } from '../middleware/validation.js';
import { authRateLimiter, registrationRateLimiter, activityRateLimiter } from '../middleware/rateLimiter.js';
import { logError, logInfo, logAuth, logSecurity, logSecurityEvent, logAuditEvent } from '../utils/logger.js';

const router = express.Router();

// Get public system configuration (no auth required)
router.get('/public-config', async (req, res) => {
  try {
    const config = await SystemConfig.getConfig();
    // Only return public settings that affect authentication
    res.json({
      success: true,
      data: {
        allowJobSeekerLoginSignup: config.general.allowJobSeekerLoginSignup,
        allowTeamOrganizationLoginSignup: config.general.allowTeamOrganizationLoginSignup,
        allowRecruiterLogin: config.general.allowRecruiterLogin,
        maintenanceMode: config.general.maintenanceMode,
      },
    });
  } catch (error) {
    logError('Get public config error', error);
    // Return defaults if error occurs
    res.json({
      success: true,
      data: {
        allowJobSeekerLoginSignup: true,
        allowTeamOrganizationLoginSignup: true,
        allowRecruiterLogin: true,
        maintenanceMode: false,
      },
    });
  }
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Register
router.post('/register', registrationRateLimiter, async (req, res) => {
  try {
    const { fullName, email, password, userType, organization } = req.body;

    // Check if job seeker registration is allowed
    const systemConfig = await SystemConfig.getConfig();
    if (!systemConfig.general.allowJobSeekerLoginSignup) {
      return res.status(403).json({
        success: false,
        message: 'Job seeker registration is currently disabled. Please contact support for assistance.',
      });
    }

    // Validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error,
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.error,
      });
    }

    const nameValidation = validateText(fullName, { required: true, minLength: 2, maxLength: 100 });
    if (!nameValidation.valid) {
      return res.status(400).json({
        success: false,
        message: nameValidation.error,
      });
    }

    // Validate organization data if provided
    if (organization && !organization.name) {
      return res.status(400).json({
        success: false,
        message: 'Organization name is required when registering as team or organization',
      });
    }

    // Prevent recruiter self-registration - only super admins can create recruiter accounts
    if (userType && (userType === 'recruiter' || userType === 'both')) {
      return res.status(403).json({
        success: false,
        message: 'Recruiter accounts can only be created by administrators. Please contact support to become a recruiter.',
      });
    }

    // Validate userType if provided (only applicant allowed for public registration)
    if (userType && userType !== 'applicant') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Only applicant accounts can be created through public registration.',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: emailValidation.value });
    if (existingUser) {
      await logSecurityEvent(
        'security_violation',
        'Registration attempt with existing email',
        {
          severity: 'medium',
          userEmail: emailValidation.value,
          statusCode: 400,
        },
        req
      );
      logSecurity('Registration attempt with existing email', { email: emailValidation.value });
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Generate verification code (6-digit)
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours expiry

    // Create user - only allow applicant type for public registration
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password,
      userType: 'applicant', // Always set to applicant for public registration
      emailVerificationCode: verificationCode,
      emailVerificationExpires: verificationExpires,
      isEmailVerified: false,
    });

    let createdOrganization = null;
    let teamMember = null;

    // Create organization if provided
    if (organization && organization.name) {
      // Check if organization name already exists
      const existingOrg = await Organization.findOne({ 
        name: organization.name.trim() 
      });
      
      if (existingOrg) {
        return res.status(400).json({
          success: false,
          message: 'An organization with this name already exists',
        });
      }

      // Create organization
      createdOrganization = new Organization({
        name: organization.name.trim(),
        industry: organization.industry || undefined,
        size: organization.size || 'small',
        website: organization.website || undefined,
        subscription: {
          plan: 'starter',
          status: 'trial',
          seats: 1,
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        },
      });

      await createdOrganization.save();

      // Link user to organization and update userType
      user.organizationId = createdOrganization._id;
      user.userType = 'both'; // User can be both applicant and recruiter when part of organization
    }

    await user.save();

    // Log audit event for user creation
    await logAuditEvent(
      'create',
      'User',
      {
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
        newValues: {
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
        },
      },
      req
    );

    // Log security event for registration
    await logSecurityEvent(
      'authentication',
      'User registered successfully',
      {
        severity: 'low',
        userId: user._id,
        userEmail: user.email,
        statusCode: 201,
      },
      req
    );

    // Create team member record if organization was created
    if (createdOrganization) {
      teamMember = new TeamMember({
        organizationId: createdOrganization._id,
        userId: user._id,
        role: 'admin',
        permissions: {
          canPostJobs: true,
          canViewAllCandidates: true,
          canManageTeam: true,
          canViewAnalytics: true,
          canManageBilling: true,
        },
        status: 'active',
        joinedAt: new Date(),
      });

      await teamMember.save();
    }

    // Generate token (for verification page access)
    const token = generateToken(user._id);

    // Send verification email
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}&code=${verificationCode}`;
      await sendVerificationEmail(
        user.email,
        user.fullName,
        verificationUrl,
        verificationCode
      );
    } catch (emailError) {
      logError('Failed to send verification email', emailError, { email: user.email });
      // Don't fail registration if email fails, user can request resend
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          credits: user.credits,
          subscription: user.subscription,
          role: user.role,
          userType: user.userType,
          organizationId: user.organizationId,
          isEmailVerified: user.isEmailVerified,
        },
        organization: createdOrganization ? {
          id: createdOrganization._id,
          name: createdOrganization.name,
          slug: createdOrganization.slug,
        } : null,
        requiresVerification: true,
      },
    });
  } catch (error) {
    logError('Registration error', error, { email: req.body.email });
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
});

// Helper function to save login attempt
const saveLoginAttempt = async (email, userId, req, success, failureReason = null) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || null;

    await LoginAttempt.create({
      email: email.toLowerCase().trim(),
      userId: userId || null,
      ipAddress,
      userAgent,
      success,
      failureReason,
    });
  } catch (error) {
    // Don't fail the login if logging fails
    logError('Failed to save login attempt', error);
  }
};

// Login
router.post('/login', authRateLimiter, async (req, res) => {
  let attemptedEmail = null;
  let user = null;
  
  try {
    const { email, password } = req.body;
    attemptedEmail = email;

    if (!email || !password) {
      await saveLoginAttempt(attemptedEmail || 'unknown', null, req, false, 'unknown');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      logSecurity('Login attempt with invalid email format', { email });
      await saveLoginAttempt(email, null, req, false, 'invalid_email_format');
      return res.status(400).json({
        success: false,
        message: emailValidation.error,
      });
    }

    // Find user and include password
    user = await User.findOne({ email: emailValidation.value }).select('+password');

    if (!user) {
      logSecurity('Login attempt with non-existent email', { email: emailValidation.value });
      await saveLoginAttempt(emailValidation.value, null, req, false, 'user_not_found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logSecurity('Login attempt with invalid password', { userId: user._id, email: emailValidation.value });
      await saveLoginAttempt(emailValidation.value, user._id, req, false, 'invalid_password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      logSecurity('Login attempt by banned user', { userId: user._id, email: emailValidation.value });
      await saveLoginAttempt(emailValidation.value, user._id, req, false, 'user_banned');
      return res.status(403).json({
        success: false,
        message: 'Your account has been banned. Please contact support if you believe this is an error.',
      });
    }

    // Check maintenance mode - allow super admins to login even during maintenance
    const systemConfig = await SystemConfig.getConfig();
    if (systemConfig.general.maintenanceMode && user.role !== 'super_admin') {
      await saveLoginAttempt(emailValidation.value, user._id, req, false, 'maintenance_mode');
      return res.status(503).json({
        success: false,
        message: 'Service is currently under maintenance. Please try again later.',
        maintenanceMode: true,
      });
    }

    // Check if job seeker login is allowed for applicant users
    if (user.userType === 'applicant' && !systemConfig.general.allowJobSeekerLoginSignup) {
      await saveLoginAttempt(emailValidation.value, user._id, req, false, 'login_disabled');
      return res.status(403).json({
        success: false,
        message: 'Job seeker login is currently disabled. Please contact support for assistance.',
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      await saveLoginAttempt(emailValidation.value, user._id, req, false, 'email_not_verified');
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in. Check your email for the verification code.',
        requiresVerification: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
          },
        },
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login and activity
    user.lastLogin = new Date();
    user.lastActivity = new Date();
    await user.save();
    
    // Save successful login attempt
    await saveLoginAttempt(emailValidation.value, user._id, req, true, null);
    
    // Emit user online status via socket (if socket service is available)
    try {
      const { emitUserStatusUpdate } = await import('../services/socketService.js');
      emitUserStatusUpdate(user._id.toString(), 'online');
    } catch (error) {
      // Silently fail if socket service is not available
      logError('Failed to emit user status update', error);
    }
    
    // Log security event
    await logSecurityEvent(
      'authentication',
      'User logged in successfully',
      {
        severity: 'low',
        userId: user._id,
        userEmail: user.email,
        statusCode: 200,
      },
      req
    );

    // Log audit event
    await logAuditEvent(
      'login',
      'User',
      {
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
      },
      req
    );
    
    logAuth('User logged in successfully', { userId: user._id, email: user.email });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          credits: user.credits,
          subscription: user.subscription,
          role: user.role,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    logError('Login error', error, { email: attemptedEmail });
    // Save failed login attempt for unknown errors
    if (attemptedEmail) {
      await saveLoginAttempt(attemptedEmail, user?._id || null, req, false, 'unknown');
    }
    res.status(500).json({
      success: false,
      message: 'Login failed',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Update last activity when user checks their profile
    user.lastActivity = new Date();
    await user.save();
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          credits: user.credits,
          subscription: user.subscription,
          role: user.role,
          userType: user.userType,
          profile: user.profile,
          preferences: user.preferences,
          resumeDefaults: user.resumeDefaults,
          stats: user.stats,
        },
      },
    });
  } catch (error) {
    logError('Get user error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
      error: error.message,
    });
  }
});

// Update user activity (heartbeat)
router.post('/activity', authenticate, activityRateLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Update last activity
    user.lastActivity = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: 'Activity updated',
    });
  } catch (error) {
    logError('Update activity error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
      error: error.message,
    });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { fullName, profile, preferences, resumeDefaults } = req.body;
    const user = await User.findById(req.user._id);

    if (fullName) user.fullName = fullName;
    if (profile) user.profile = { ...user.profile, ...profile };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (resumeDefaults) user.resumeDefaults = { ...user.resumeDefaults, ...resumeDefaults };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    logError('Update profile error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
});

// Verify email with code
router.post('/verify-email', authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please request a new one.',
      });
    }

    if (new Date() > user.emailVerificationExpires) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    if (user.emailVerificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Verify the email
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    logError('Verify email error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message,
    });
  }
});

// Resend verification email
router.post('/resend-verification', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    try {
      const token = generateToken(user._id);
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}&code=${verificationCode}`;
      await sendVerificationEmail(
        user.email,
        user.fullName,
        verificationUrl,
        verificationCode
      );

      res.json({
        success: true,
        message: 'Verification email sent successfully',
      });
    } catch (emailError) {
      logError('Failed to send verification email', emailError, { email: user.email });
      
      // Check if it's a SendGrid sender identity error
      const isSenderIdentityError = emailError.response?.body?.errors?.some(
        err => err.field === 'from' && err.message?.includes('verified Sender Identity')
      );
      
      if (isSenderIdentityError) {
        res.status(503).json({
          success: false,
          message: 'Email service is not properly configured. Please contact support.',
          error: 'SENDGRID_SENDER_IDENTITY_NOT_VERIFIED',
          ...(process.env.NODE_ENV === 'development' && {
            details: 'The SendGrid sender identity is not verified. Check server logs for more information.',
          }),
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send verification email. Please try again later.',
          error: emailError.message,
          ...(process.env.NODE_ENV === 'development' && {
            details: emailError.message,
          }),
        });
      }
    }
  } catch (error) {
    logError('Resend verification error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message,
    });
  }
});

// Verify email with code (unauthenticated - for users who can't log in)
router.post('/verify-email-unauthenticated', authRateLimiter, async (req, res) => {
  try {
    const { code, email } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error,
      });
    }

    // Find user by email
    const user = await User.findOne({ email: emailValidation.value });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please request a new one.',
      });
    }

    if (new Date() > user.emailVerificationExpires) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    if (user.emailVerificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Verify the email
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate token for automatic login
    const token = generateToken(user._id);

    logInfo('Email verified (unauthenticated)', { email: user.email, userId: user._id });

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    logError('Verify email (unauthenticated) error', error, { email: req.body?.email });
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message,
    });
  }
});

// Resend verification email (unauthenticated - for users who can't log in)
router.post('/resend-verification-unauthenticated', authRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error,
      });
    }

    // Find user
    const user = await User.findOne({ email: emailValidation.value });

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with this email exists and is unverified, a verification email has been sent.',
      });
    }

    // If email is already verified, don't reveal it but return success
    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message: 'If an account with this email exists and is unverified, a verification email has been sent.',
      });
    }

    // Generate new verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    try {
      const token = generateToken(user._id);
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}&code=${verificationCode}`;
      await sendVerificationEmail(
        user.email,
        user.fullName,
        verificationUrl,
        verificationCode
      );

      logInfo('Verification email resent (unauthenticated)', { email: user.email });

      res.json({
        success: true,
        message: 'If an account with this email exists and is unverified, a verification email has been sent.',
      });
    } catch (emailError) {
      logError('Failed to send verification email (unauthenticated)', emailError, { email: user.email });
      
      // Check if it's a SendGrid configuration error
      const isSenderIdentityError = emailError.response?.body?.errors?.some(
        err => err.field === 'from' && err.message?.includes('verified Sender Identity')
      );
      
      if (isSenderIdentityError) {
        res.status(503).json({
          success: false,
          message: 'Email service is not properly configured. Please contact support.',
          error: 'SENDGRID_SENDER_IDENTITY_NOT_VERIFIED',
          ...(process.env.NODE_ENV === 'development' && {
            details: 'The SendGrid sender identity is not verified. Check server logs for more information.',
          }),
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send verification email. Please try again later.',
          error: emailError.message,
          ...(process.env.NODE_ENV === 'development' && {
            details: emailError.message,
          }),
        });
      }
    }
  } catch (error) {
    logError('Resend verification (unauthenticated) error', error, { email: req.body?.email });
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message,
    });
  }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Set lastActivity to an old date to ensure offline status
      // This ensures the user shows as offline immediately
      const oldDate = new Date();
      oldDate.setMinutes(oldDate.getMinutes() - 10); // 10 minutes ago
      user.lastActivity = oldDate;
      await user.save();
    }
    
    const userId = req.user._id.toString();
    
    // Emit user offline status via socket (if socket service is available)
    try {
      const { emitUserStatusUpdate, getIO } = await import('../services/socketService.js');
      emitUserStatusUpdate(userId, 'offline');
      
      // Disconnect user's socket if connected
      const io = getIO();
      if (io) {
        // Find and disconnect user's socket
        const sockets = await io.fetchSockets();
        for (const socket of sockets) {
          if (socket.userId === userId) {
            socket.emit('logout');
            socket.disconnect();
            break;
          }
        }
      }
    } catch (error) {
      // Silently fail if socket service is not available
      logError('Failed to emit user status update on logout', error);
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logError('Logout error', error);
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
});

export default router;

