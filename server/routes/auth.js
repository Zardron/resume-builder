import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import TeamMember from '../models/TeamMember.js';
import { authenticate } from '../middleware/auth.js';
import { sendVerificationEmail } from '../services/emailService.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, userType, organization } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
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
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
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
      console.error('Failed to send verification email:', emailError);
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
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
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

    // Update last login
    user.lastLogin = new Date();
    await user.save();

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
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
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
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
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
    console.error('Update profile error:', error);
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
    console.error('Verify email error:', error);
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
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message,
    });
  }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticate, async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;

