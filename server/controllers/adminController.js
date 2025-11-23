import Organization from '../models/Organization.js';
import TeamMember from '../models/TeamMember.js';
import User from '../models/User.js';
import JobPosting from '../models/JobPosting.js';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService.js';

/**
 * Create organization with multiple team members (Super Admin only)
 * This allows super admin to create recruiter/team accounts with multiple email addresses
 */
export const createOrganizationWithMembers = async (req, res) => {
  try {
    const { 
      organizationName, 
      industry, 
      size, 
      website, 
      emails, // Array of email objects: [{email, fullName, role, department}]
      subscriptionPlan 
    } = req.body;

    // Validation
    if (!organizationName || !emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Organization name and at least one email are required',
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    for (const emailData of emails) {
      if (!emailData.email || !emailRegex.test(emailData.email)) {
        return res.status(400).json({
          success: false,
          message: `Invalid email format: ${emailData.email}`,
        });
      }
      if (!emailData.fullName) {
        return res.status(400).json({
          success: false,
          message: `Full name is required for ${emailData.email}`,
        });
      }
    }

    // Create organization
    const organization = new Organization({
      name: organizationName,
      industry,
      size: size || 'small',
      website,
      subscription: {
        plan: subscriptionPlan || 'starter',
        status: 'trial',
        seats: emails.length,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      },
    });

    await organization.save();

    const createdUsers = [];
    const invitedUsers = [];
    const errors = [];

    // Process each email
    for (const emailData of emails) {
      const { email, fullName, role = 'recruiter', department } = emailData;
      const normalizedEmail = email.toLowerCase().trim();

      try {
        // Check if user already exists
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
          // User exists - check if already in an organization
          if (user.organizationId) {
            errors.push({
              email: normalizedEmail,
              message: `User ${normalizedEmail} already belongs to an organization`,
            });
            continue;
          }

          // Update existing user
          user.organizationId = organization._id;
          user.userType = user.userType === 'applicant' ? 'both' : 'recruiter';
          await user.save();
          createdUsers.push(user);
        } else {
          // Create new user with temporary password
          const tempPassword = crypto.randomBytes(12).toString('hex');
          const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

          user = new User({
            fullName,
            email: normalizedEmail,
            password: tempPassword, // Will be hashed by pre-save hook
            role: 'user',
            userType: 'recruiter',
            organizationId: organization._id,
            isEmailVerified: false,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            credits: 0,
          });

          await user.save();
          createdUsers.push(user);

          // Send invitation email
          // Note: User will need to verify email first, then can set password via password reset if needed
          const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?code=${verificationCode}&email=${encodeURIComponent(normalizedEmail)}`;
          
          const emailSubject = `You've been invited to join ${organizationName} on ResumeIQHub`;
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Welcome to ${organizationName}!</h2>
              <p>Hi ${fullName},</p>
              <p>You've been invited to join <strong>${organizationName}</strong> on ResumeIQHub as a ${role}.</p>
              <p>Click the button below to verify your email and set up your account:</p>
              <a href="${verificationUrl}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                Verify Email & Get Started
              </a>
              <p>Or use this verification code: <strong>${verificationCode}</strong></p>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                <strong>Note:</strong> After verifying your email, you can set your password using the "Forgot Password" option on the login page.
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 10px;">
                This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
          `;
          const emailText = `Hi ${fullName},\n\nYou've been invited to join ${organizationName} on ResumeIQHub as a ${role}.\n\nVerify your email: ${verificationUrl}\n\nOr use this verification code: ${verificationCode}\n\nNote: After verifying your email, you can set your password using the "Forgot Password" option on the login page.\n\nThis invitation will expire in 7 days.`;

          try {
            await sendEmail({
              to: normalizedEmail,
              subject: emailSubject,
              text: emailText,
              html: emailHtml,
            });
            invitedUsers.push({ email: normalizedEmail, fullName });
          } catch (emailError) {
            console.error(`Failed to send invitation email to ${normalizedEmail}:`, emailError);
            errors.push({
              email: normalizedEmail,
              message: `User created but invitation email failed to send`,
            });
          }
        }

        // Create team member record
        const teamMemberRole = role === 'admin' ? 'admin' : role === 'manager' ? 'manager' : 'recruiter';
        const teamMember = new TeamMember({
          organizationId: organization._id,
          userId: user._id,
          role: teamMemberRole,
          department,
          permissions: {
            canPostJobs: true,
            canViewAllCandidates: true,
            canManageTeam: teamMemberRole === 'admin' || teamMemberRole === 'manager',
            canViewAnalytics: true,
            canManageBilling: teamMemberRole === 'admin',
          },
          invitedBy: req.user._id,
          status: user.isEmailVerified ? 'active' : 'pending',
          joinedAt: user.isEmailVerified ? new Date() : null,
        });

        await teamMember.save();
      } catch (error) {
        console.error(`Error processing user ${emailData.email}:`, error);
        errors.push({
          email: emailData.email,
          message: error.message || 'Failed to process user',
        });
      }
    }

    // Update organization seats count
    organization.subscription.seats = createdUsers.length;
    await organization.save();

    res.status(201).json({
      success: true,
      message: `Organization created successfully. ${createdUsers.length} user(s) processed.`,
      data: {
        organization,
        usersCreated: createdUsers.length,
        usersInvited: invitedUsers.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Create organization with members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create organization',
      error: error.message,
    });
  }
};

/**
 * Get all organizations (Super Admin only)
 */
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate({
        path: 'subscription',
        select: 'plan status seats',
      })
      .sort({ createdAt: -1 });

    // Get member counts for each organization
    const organizationsWithCounts = await Promise.all(
      organizations.map(async (org) => {
        const memberCount = await TeamMember.countDocuments({
          organizationId: org._id,
          status: { $in: ['active', 'pending'] },
        });
        return {
          ...org.toObject(),
          memberCount,
        };
      })
    );

    res.json({
      success: true,
      data: organizationsWithCounts,
    });
  } catch (error) {
    console.error('Get all organizations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get organizations',
      error: error.message,
    });
  }
};

/**
 * Get organization details with all members (Super Admin only)
 */
export const getOrganizationDetails = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    const teamMembers = await TeamMember.find({
      organizationId: req.params.orgId,
    })
      .populate('userId', 'fullName email profile.avatar isEmailVerified')
      .populate('invitedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        organization,
        teamMembers,
      },
    });
  } catch (error) {
    console.error('Get organization details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get organization details',
      error: error.message,
    });
  }
};

/**
 * Get all recruiters/users (Super Admin only)
 */
export const getAllRecruiters = async (req, res) => {
  try {
    // Get all users who are recruiters (userType includes 'recruiter' or 'both')
    // Exclude super_admin accounts as they are not recruiter accounts
    const recruiters = await User.find({
      $and: [
        {
          $or: [
            { userType: 'recruiter' },
            { userType: 'both' },
            { organizationId: { $exists: true, $ne: null } }
          ]
        },
        { role: { $ne: 'super_admin' } } // Exclude super_admin
      ]
    })
      .populate('organizationId', 'name industry size website')
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });

    // Get additional stats for each recruiter
    const recruitersWithStats = await Promise.all(
      recruiters.map(async (recruiter) => {
        // Get team member info if exists
        const teamMember = await TeamMember.findOne({ userId: recruiter._id })
          .populate('organizationId', 'name');
        
        // Count job postings
        const jobCount = await JobPosting.countDocuments({ 
          postedBy: recruiter._id 
        });

        return {
          ...recruiter.toObject(),
          teamMemberRole: teamMember?.role || null,
          teamMemberStatus: teamMember?.status || null,
          jobCount,
        };
      })
    );

    res.json({
      success: true,
      data: recruitersWithStats,
    });
  } catch (error) {
    console.error('Get all recruiters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recruiters',
      error: error.message,
    });
  }
};

