import Organization from '../models/Organization.js';
import TeamMember from '../models/TeamMember.js';
import User from '../models/User.js';
import JobPosting from '../models/JobPosting.js';
import SystemConfig from '../models/SystemConfig.js';
import LoginAttempt from '../models/LoginAttempt.js';
import SecurityLog from '../models/SecurityLog.js';
import AuditLog from '../models/AuditLog.js';
import ClientLog from '../models/ClientLog.js';
import Application from '../models/Application.js';
import { logError } from '../utils/logger.js';
import Payment from '../models/Payment.js';
import Resume from '../models/Resume.js';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService.js';

// Lazy import for socket service to avoid circular dependencies
let socketService = null;
const getSocketService = async () => {
  if (!socketService) {
    socketService = await import('../services/socketService.js');
  }
  return socketService;
};

export const createOrganizationWithMembers = async (req, res) => {
  try {
    const { organizationName, industry, size, website, emails, subscriptionPlan } = req.body;

    if (!organizationName || !emails?.length) {
      return res.status(400).json({
        success: false,
        message: 'Organization name and at least one email are required',
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    for (const emailData of emails) {
      if (!emailData.email || !emailRegex.test(emailData.email)) {
        return res.status(400).json({
          success: false,
          message: `Invalid email: ${emailData.email}`,
        });
      }
      if (!emailData.fullName) {
        return res.status(400).json({
          success: false,
          message: `Full name required for ${emailData.email}`,
        });
      }
    }

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
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    await organization.save();

    const users = [];
    const invited = [];
    const errors = [];

    for (const emailData of emails) {
      const { email, fullName, role = 'recruiter', department } = emailData;
      const emailLower = email.toLowerCase().trim();

      try {
        let user = await User.findOne({ email: emailLower });

        if (user) {
          if (user.organizationId) {
            errors.push({
              email: emailLower,
              message: 'User already in organization',
            });
            continue;
          }

          user.organizationId = organization._id;
          user.userType = user.userType === 'applicant' ? 'both' : 'recruiter';
          await user.save();
          users.push(user);
        } else {
          const tempPassword = crypto.randomBytes(12).toString('hex');
          const code = crypto.randomBytes(3).toString('hex').toUpperCase();

          user = new User({
            fullName,
            email: emailLower,
            password: tempPassword,
            role: 'user',
            userType: 'recruiter',
            organizationId: organization._id,
            isEmailVerified: false,
            emailVerificationCode: code,
            emailVerificationExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            credits: 0,
          });

          await user.save();
          users.push(user);

          const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?code=${code}&email=${encodeURIComponent(emailLower)}`;
          
          const subject = `You've been invited to join ${organizationName}`;
          const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<h2 style="color: #2563eb;">Welcome to ${organizationName}!</h2>
<p>Hi ${fullName},</p>
<p>You've been invited to join <strong>${organizationName}</strong> on ResumeIQHub as a ${role}.</p>
<p>Click below to verify your email:</p>
<a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Verify Email</a>
<p>Or use code: <strong>${code}</strong></p>
<p style="color: #666; font-size: 14px;">After verifying, set your password via "Forgot Password" on the login page. This invitation expires in 7 days.</p>
</div>`;
          const text = `Hi ${fullName},\n\nYou've been invited to join ${organizationName} as a ${role}.\n\nVerify: ${verifyUrl}\n\nCode: ${code}\n\nSet password via "Forgot Password" after verification. Expires in 7 days.`;

          try {
            await sendEmail({
              to: emailLower,
              subject,
              text,
              html,
            });
            invited.push({ email: emailLower, fullName });
          } catch (emailError) {
            logError(`Email send failed for ${emailLower}`, emailError);
            errors.push({
              email: emailLower,
              message: 'User created but email failed',
            });
          }
        }

        const memberRole = ['admin', 'manager'].includes(role) ? role : 'recruiter';
        const member = new TeamMember({
          organizationId: organization._id,
          userId: user._id,
          role: memberRole,
          department,
          permissions: {
            canPostJobs: true,
            canViewAllCandidates: true,
            canManageTeam: memberRole === 'admin' || memberRole === 'manager',
            canViewAnalytics: true,
            canManageBilling: memberRole === 'admin',
          },
          invitedBy: req.user._id,
          status: user.isEmailVerified ? 'active' : 'pending',
          joinedAt: user.isEmailVerified ? new Date() : null,
        });

        await member.save();
      } catch (err) {
        logError(`Error processing ${emailData.email}`, err);
        errors.push({
          email: emailData.email,
          message: err.message || 'Could not process user',
        });
      }
    }

    organization.subscription.seats = users.length;
    await organization.save();

    res.status(201).json({
      success: true,
      message: `Organization created. ${users.length} user(s) processed.`,
      data: {
        organization,
        usersCreated: users.length,
        usersInvited: invited.length,
        ...(errors.length && { errors }),
      },
    });
  } catch (err) {
    logError('Create org error', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err.message,
    });
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate({
        path: 'subscription',
        select: 'plan status seats',
      })
      .sort({ createdAt: -1 });

    const orgs = await Promise.all(
      organizations.map(async (org) => {
        const count = await TeamMember.countDocuments({
          organizationId: org._id,
          status: { $in: ['active', 'pending'] },
        });
        return { ...org.toObject(), memberCount: count };
      })
    );

    res.json({
      success: true,
      data: orgs,
    });
  } catch (err) {
    logError('Get orgs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch organizations',
      error: err.message,
    });
  }
};

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
  } catch (err) {
    logError('Get org error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch organization',
      error: err.message,
    });
  }
};

export const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({
      $and: [
        {
          $or: [
            { userType: 'recruiter' },
            { userType: 'both' },
            { organizationId: { $exists: true, $ne: null } }
          ]
        },
        { role: { $ne: 'super_admin' } }
      ]
    })
      .populate('organizationId', 'name industry size website')
      .select('-password')
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      recruiters.map(async (recruiter) => {
        const member = await TeamMember.findOne({ userId: recruiter._id })
          .populate('organizationId', 'name');
        const jobCount = await JobPosting.countDocuments({ postedBy: recruiter._id });

        return {
          ...recruiter.toObject(),
          teamMemberRole: member?.role || null,
          teamMemberStatus: member?.status || null,
          jobCount,
        };
      })
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    logError('Get recruiters error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch recruiters',
      error: err.message,
    });
  }
};

export const getSystemConfig = async (req, res) => {
  try {
    const config = await SystemConfig.getConfig();
    res.json({
      success: true,
      data: config,
    });
  } catch (err) {
    logError('Get config error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch config',
      error: err.message,
    });
  }
};

export const updateSystemConfig = async (req, res) => {
  try {
    const { general, security, notifications, integrations, logRetention } = req.body;
    
    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig({});
    }

    if (general) config.general = { ...config.general, ...general };
    if (security) config.security = { ...config.security, ...security };
    if (notifications) config.notifications = { ...config.notifications, ...notifications };
    if (integrations) config.integrations = { ...config.integrations, ...integrations };
    if (logRetention) config.logRetention = { ...config.logRetention, ...logRetention };

    await config.save();

    res.json({
      success: true,
      message: 'Config updated',
      data: config,
    });
  } catch (err) {
    logError('Update config error', err);
    res.status(500).json({
      success: false,
      message: 'Could not update config',
      error: err.message,
    });
  }
};

export const getLoginAttempts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      email,
      ipAddress,
      success,
      failureReason,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {
      status: { $ne: 'deleted' } // Exclude deleted logs
    };

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (ipAddress) {
      query.ipAddress = { $regex: ipAddress, $options: 'i' };
    }

    if (success !== undefined) {
      query.success = success === 'true';
    }

    if (failureReason) {
      query.failureReason = failureReason;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [attempts, total] = await Promise.all([
      LoginAttempt.find(query)
        .populate('userId', 'fullName email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      LoginAttempt.countDocuments(query),
    ]);

    // Get statistics
    const stats = await LoginAttempt.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          successfulAttempts: {
            $sum: { $cond: ['$success', 1, 0] }
          },
          failedAttempts: {
            $sum: { $cond: ['$success', 0, 1] }
          },
          uniqueEmails: { $addToSet: '$email' },
          uniqueIPs: { $addToSet: '$ipAddress' },
        },
      },
      {
        $project: {
          totalAttempts: 1,
          successfulAttempts: 1,
          failedAttempts: 1,
          uniqueEmailCount: { $size: '$uniqueEmails' },
          uniqueIPCount: { $size: '$uniqueIPs' },
        },
      },
    ]);

    const statistics = stats[0] || {
      totalAttempts: 0,
      successfulAttempts: 0,
      failedAttempts: 0,
      uniqueEmailCount: 0,
      uniqueIPCount: 0,
    };

    res.json({
      success: true,
      data: {
        attempts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        statistics,
      },
    });
  } catch (err) {
    logError('Get login attempts error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch login attempts',
      error: err.message,
    });
  }
};

// ============================================
// Security Logging Endpoints
// ============================================

/**
 * Get security logs with filtering and pagination
 */
export const getSecurityLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      eventType,
      severity,
      userId,
      userEmail,
      ipAddress,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {
      status: { $ne: 'deleted' } // Exclude deleted logs
    };

    if (eventType) {
      query.eventType = eventType;
    }

    if (severity) {
      query.severity = severity;
    }

    if (userId) {
      query.userId = userId;
    }

    if (userEmail) {
      query.userEmail = { $regex: userEmail, $options: 'i' };
    }

    if (ipAddress) {
      query.ipAddress = { $regex: ipAddress, $options: 'i' };
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [logs, total] = await Promise.all([
      SecurityLog.find(query)
        .populate('userId', 'fullName email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      SecurityLog.countDocuments(query),
    ]);

    // Get statistics
    const stats = await SecurityLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          bySeverity: {
            $push: '$severity',
          },
          byEventType: {
            $push: '$eventType',
          },
          uniqueUsers: { $addToSet: '$userId' },
          uniqueIPs: { $addToSet: '$ipAddress' },
        },
      },
      {
        $project: {
          total: 1,
          critical: { $size: { $filter: { input: '$bySeverity', as: 's', cond: { $eq: ['$$s', 'critical'] } } } },
          high: { $size: { $filter: { input: '$bySeverity', as: 's', cond: { $eq: ['$$s', 'high'] } } } },
          medium: { $size: { $filter: { input: '$bySeverity', as: 's', cond: { $eq: ['$$s', 'medium'] } } } },
          low: { $size: { $filter: { input: '$bySeverity', as: 's', cond: { $eq: ['$$s', 'low'] } } } },
          uniqueUserCount: { $size: { $filter: { input: '$uniqueUsers', as: 'u', cond: { $ne: ['$$u', null] } } } },
          uniqueIPCount: { $size: '$uniqueIPs' },
        },
      },
    ]);

    const statistics = stats[0] || {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      uniqueUserCount: 0,
      uniqueIPCount: 0,
    };

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        statistics,
      },
    });
  } catch (err) {
    logError('Get security logs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch security logs',
      error: err.message,
    });
  }
};

/**
 * Get audit logs with filtering and pagination
 */
export const getAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      resourceType,
      resourceId,
      userId,
      userEmail,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {
      status: { $ne: 'deleted' } // Exclude deleted logs
    };

    if (action) {
      query.action = action;
    }

    if (resourceType) {
      query.resourceType = resourceType;
    }

    if (resourceId) {
      query.resourceId = resourceId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (userEmail) {
      query.userEmail = { $regex: userEmail, $options: 'i' };
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('userId', 'fullName email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    // Get statistics
    const stats = await AuditLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byAction: {
            $push: '$action',
          },
          byResourceType: {
            $push: '$resourceType',
          },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          total: 1,
          uniqueUserCount: { $size: { $filter: { input: '$uniqueUsers', as: 'u', cond: { $ne: ['$$u', null] } } } },
        },
      },
    ]);

    const statistics = stats[0] || {
      total: 0,
      uniqueUserCount: 0,
    };

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        statistics,
      },
    });
  } catch (err) {
    logError('Get audit logs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch audit logs',
      error: err.message,
    });
  }
};

/**
 * Get client logs with filtering and pagination
 */
export const getClientLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      eventType,
      severity,
      userId,
      route,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {
      status: { $ne: 'deleted' } // Exclude deleted logs
    };

    if (eventType) {
      query.eventType = eventType;
    }

    if (severity) {
      query.severity = severity;
    }

    if (userId) {
      query.userId = userId;
    }

    if (route) {
      query.route = { $regex: route, $options: 'i' };
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [logs, total] = await Promise.all([
      ClientLog.find(query)
        .populate('userId', 'fullName email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ClientLog.countDocuments(query),
    ]);

    // Get statistics
    const stats = await ClientLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          bySeverity: {
            $push: '$severity',
          },
          byEventType: {
            $push: '$eventType',
          },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          total: 1,
          critical: { $size: { $filter: { input: '$bySeverity', as: 's', cond: { $eq: ['$$s', 'critical'] } } } },
          error: { $size: { $filter: { input: '$bySeverity', as: 's', cond: { $eq: ['$$s', 'error'] } } } },
          warning: { $size: { $filter: { input: '$bySeverity', as: 's', cond: { $eq: ['$$s', 'warning'] } } } },
          info: { $size: { $filter: { input: '$bySeverity', as: 's', cond: { $eq: ['$$s', 'info'] } } } },
          uniqueUserCount: { $size: { $filter: { input: '$uniqueUsers', as: 'u', cond: { $ne: ['$$u', null] } } } },
        },
      },
    ]);

    const statistics = stats[0] || {
      total: 0,
      critical: 0,
      error: 0,
      warning: 0,
      info: 0,
      uniqueUserCount: 0,
    };

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        statistics,
      },
    });
  } catch (err) {
    logError('Get client logs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch client logs',
      error: err.message,
    });
  }
};

/**
 * Endpoint to receive client logs from frontend
 */
export const createClientLog = async (req, res) => {
  try {
    const logData = req.body;
    
    // Use the logging service to create the log
    const { logClientEvent } = await import('../utils/logger.js');
    await logClientEvent(
      logData.eventType,
      logData.message,
      logData
    );

    res.json({
      success: true,
      message: 'Log recorded',
    });
  } catch (err) {
    logError('Create client log error', err);
    res.status(500).json({
      success: false,
      message: 'Could not record log',
      error: err.message,
    });
  }
};

/**
 * Get all users for admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate('organizationId', 'name industry size website')
      .select('-password')
      .sort({ createdAt: -1 });

    const currentUserId = req.user._id.toString();

    const result = await Promise.all(
      users.map(async (user) => {
        const member = await TeamMember.findOne({ userId: user._id })
          .populate('organizationId', 'name');
        
        // Determine role for display
        let displayRole = user.role;
        if (member) {
          displayRole = member.role;
        } else if (user.userType === 'recruiter' || user.userType === 'both') {
          displayRole = 'recruiter';
        } else {
          displayRole = 'applicant';
        }

        // Check if user has AI subscription
        const hasAISubscription = user.subscription?.status === 'active' && 
                                  ['basic', 'pro', 'enterprise'].includes(user.subscription?.plan);

        // Check if this is the current user
        const isCurrentUser = user._id.toString() === currentUserId;

        // Check if user is online based on lastActivity (within 2 minutes) or lastLogin (within 5 minutes)
        // Also check if user has active socket connection
        let hasActiveConnection = false;
        try {
          const socketServiceModule = await getSocketService();
          hasActiveConnection = socketServiceModule.isUserConnected(user._id.toString());
        } catch (error) {
          // Silently fail if socket service is not available
        }
        
        const isOnlineByTime = (user.lastActivity && (Date.now() - new Date(user.lastActivity).getTime() < 2 * 60 * 1000)) ||
                              (user.lastLogin && (Date.now() - new Date(user.lastLogin).getTime() < 5 * 60 * 1000));
        
        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: displayRole,
          organization: user.organizationId?.name || null,
          status: hasActiveConnection || isOnlineByTime ? 'online' : 'offline',
          joinedAt: user.createdAt,
          isBanned: user.isBanned || false,
          hasAISubscription,
          isCurrentUser,
        };
      })
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    logError('Get all users error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch users',
      error: err.message,
    });
  }
};

/**
 * Ban or unban a user
 */
export const toggleUserBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBanned } = req.body;
    const currentUserId = req.user._id.toString();

    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isBanned must be a boolean',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent banning yourself
    if (userId === currentUserId && isBanned) {
      return res.status(400).json({
        success: false,
        message: 'You cannot ban your own account',
      });
    }

    // Prevent banning super admins
    if (user.role === 'super_admin' && isBanned) {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban super admin users',
      });
    }

    user.isBanned = isBanned;
    await user.save();

    // If user is being banned, emit socket event to logout the user if they're online
    if (isBanned) {
      try {
        const socketService = await getSocketService();
        socketService.emitUserBanned(userId);
      } catch (error) {
        // Silently fail if socket service is not available
        logError('Failed to emit user ban event', error);
      }
    }

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    await logAuditEvent(
      req.user._id,
      isBanned ? 'ban_user' : 'unban_user',
      'user',
      userId,
      {
        userEmail: user.email,
        userName: user.fullName,
      }
    );

    res.json({
      success: true,
      message: isBanned ? 'User banned successfully' : 'User unbanned successfully',
      data: {
        userId: user._id,
        isBanned: user.isBanned,
      },
    });
  } catch (err) {
    logError('Toggle user ban error', err);
    res.status(500).json({
      success: false,
      message: 'Could not update user ban status',
      error: err.message,
    });
  }
};

/**
 * Get log statistics
 */
export const getLogStatistics = async (req, res) => {
  try {
    const { getLogStatistics } = await import('../services/logCleanupService.js');
    const stats = await getLogStatistics();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    logError('Get log statistics error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch log statistics',
      error: err.message,
    });
  }
};

/**
 * Manual cleanup of soft-deleted logs
 */
export const cleanupSoftDeletedLogs = async (req, res) => {
  try {
    const { cleanupSoftDeletedLogs } = await import('../services/logCleanupService.js');
    const result = await cleanupSoftDeletedLogs();
    
    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    await logAuditEvent(
      'delete',
      'LogCleanup',
      {
        userId: req.user._id,
        description: `Manual cleanup: Permanently deleted ${result.deleted.total} soft-deleted logs`,
      },
      req
    );

    res.json({
      success: true,
      message: `Successfully cleaned up ${result.deleted.total} soft-deleted logs`,
      data: result.deleted,
    });
  } catch (err) {
    logError('Cleanup soft-deleted logs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not cleanup logs',
      error: err.message,
    });
  }
};

/**
 * Manual cleanup of old active logs
 */
export const cleanupOldActiveLogs = async (req, res) => {
  try {
    const { logType } = req.body || {};
    const { cleanupOldActiveLogs } = await import('../services/logCleanupService.js');
    const result = await cleanupOldActiveLogs(logType || 'all');
    
    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    await logAuditEvent(
      'delete',
      'LogCleanup',
      {
        userId: req.user._id,
        description: `Manual cleanup: Permanently deleted ${result.deleted.total} old active logs`,
      },
      req
    );

    res.json({
      success: true,
      message: `Successfully cleaned up ${result.deleted.total} old active logs`,
      data: result.deleted,
    });
  } catch (err) {
    logError('Cleanup old active logs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not cleanup logs',
      error: err.message,
    });
  }
};

/**
 * Get platform-wide statistics for super admin dashboard
 */
export const getPlatformStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const days = parseInt(period, 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total counts
    const [
      totalOrganizations,
      totalUsers,
      totalRecruiters,
      totalJobs,
      totalApplications,
      totalResumes,
      totalPayments,
      activeOrganizations,
      activeRecruiters,
      activeJobs,
      systemAdmins,
    ] = await Promise.all([
      Organization.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ $or: [{ userType: 'recruiter' }, { userType: 'both' }] }),
      JobPosting.countDocuments(),
      Application.countDocuments(),
      Resume.countDocuments(),
      Payment.countDocuments({ status: 'completed' }),
      Organization.countDocuments({ 'subscription.status': 'active' }),
      TeamMember.countDocuments({ status: 'active' }),
      JobPosting.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'super_admin' }),
    ]);

    // Get growth metrics (this period vs previous period)
    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - (days * 2));
    
    const [
      newOrganizations,
      newUsers,
      newRecruiters,
      newJobs,
      newApplications,
      newResumes,
      previousOrganizations,
      previousUsers,
      previousRecruiters,
      previousJobs,
      previousApplications,
      previousResumes,
    ] = await Promise.all([
      Organization.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ 
        createdAt: { $gte: startDate },
        $or: [{ userType: 'recruiter' }, { userType: 'both' }]
      }),
      JobPosting.countDocuments({ createdAt: { $gte: startDate } }),
      Application.countDocuments({ createdAt: { $gte: startDate } }),
      Resume.countDocuments({ createdAt: { $gte: startDate } }),
      Organization.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: startDate } 
      }),
      User.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: startDate } 
      }),
      User.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: startDate },
        $or: [{ userType: 'recruiter' }, { userType: 'both' }]
      }),
      JobPosting.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: startDate } 
      }),
      Application.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: startDate } 
      }),
      Resume.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: startDate } 
      }),
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    // Get revenue metrics
    const revenueData = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          subscriptionRevenue: {
            $sum: {
              $cond: [{ $eq: ['$type', 'subscription'] }, '$amount', 0]
            }
          },
          creditRevenue: {
            $sum: {
              $cond: [{ $eq: ['$type', 'credits'] }, '$amount', 0]
            }
          },
          transactionCount: { $sum: 1 },
        }
      }
    ]);

    const revenue = revenueData[0] || {
      totalRevenue: 0,
      subscriptionRevenue: 0,
      creditRevenue: 0,
      transactionCount: 0,
    };

    // Get daily growth data for charts (last 30 days)
    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [orgs, users, jobs, apps] = await Promise.all([
        Organization.countDocuments({
          createdAt: { $gte: date, $lt: nextDate }
        }),
        User.countDocuments({
          createdAt: { $gte: date, $lt: nextDate }
        }),
        JobPosting.countDocuments({
          createdAt: { $gte: date, $lt: nextDate }
        }),
        Application.countDocuments({
          createdAt: { $gte: date, $lt: nextDate }
        }),
      ]);

      dailyData.push({
        date: date.toISOString().split('T')[0],
        organizations: orgs,
        users: users,
        jobs: jobs,
        applications: apps,
      });
    }

    // Get top performing organizations
    const topOrganizations = await Organization.aggregate([
      {
        $lookup: {
          from: 'jobpostings',
          localField: '_id',
          foreignField: 'organizationId',
          as: 'jobs'
        }
      },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'organizationId',
          as: 'applications'
        }
      },
      {
        $project: {
          name: 1,
          industry: 1,
          'subscription.plan': 1,
          'subscription.status': 1,
          jobCount: { $size: '$jobs' },
          applicationCount: { $size: '$applications' },
          createdAt: 1,
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: 5 }
    ]);

    // Get recent activity
    const [recentUsers, recentOrgs, recentJobs, recentSecurityLogs] = await Promise.all([
      User.find()
        .select('fullName email role createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Organization.find()
        .select('name industry createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      JobPosting.find()
        .populate('organizationId', 'name')
        .select('title status createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      SecurityLog.find()
        .populate('userId', 'fullName email')
        .select('eventType severity message timestamp')
        .sort({ timestamp: -1 })
        .limit(5)
        .lean(),
    ]);

    // Get system health metrics
    const [failedLogins, criticalSecurityLogs, errorClientLogs] = await Promise.all([
      LoginAttempt.countDocuments({
        success: false,
        timestamp: { $gte: startDate }
      }),
      SecurityLog.countDocuments({
        severity: 'critical',
        timestamp: { $gte: startDate }
      }),
      ClientLog.countDocuments({
        severity: { $in: ['error', 'critical'] },
        timestamp: { $gte: startDate }
      }),
    ]);

    res.json({
      success: true,
      data: {
        totals: {
          organizations: totalOrganizations,
          users: totalUsers,
          recruiters: totalRecruiters,
          jobs: totalJobs,
          applications: totalApplications,
          resumes: totalResumes,
          activeOrganizations,
          activeRecruiters,
          activeJobs,
          systemAdmins,
        },
        growth: {
          organizations: {
            current: newOrganizations,
            previous: previousOrganizations,
            percentage: calculateGrowth(newOrganizations, previousOrganizations),
          },
          users: {
            current: newUsers,
            previous: previousUsers,
            percentage: calculateGrowth(newUsers, previousUsers),
          },
          recruiters: {
            current: newRecruiters,
            previous: previousRecruiters,
            percentage: calculateGrowth(newRecruiters, previousRecruiters),
          },
          jobs: {
            current: newJobs,
            previous: previousJobs,
            percentage: calculateGrowth(newJobs, previousJobs),
          },
          applications: {
            current: newApplications,
            previous: previousApplications,
            percentage: calculateGrowth(newApplications, previousApplications),
          },
          resumes: {
            current: newResumes,
            previous: previousResumes,
            percentage: calculateGrowth(newResumes, previousResumes),
          },
        },
        revenue: {
          total: revenue.totalRevenue,
          subscription: revenue.subscriptionRevenue,
          credits: revenue.creditRevenue,
          transactions: revenue.transactionCount,
        },
        dailyData,
        topOrganizations,
        recentActivity: {
          users: recentUsers,
          organizations: recentOrgs,
          jobs: recentJobs,
          securityLogs: recentSecurityLogs,
        },
        systemHealth: {
          failedLogins,
          criticalSecurityLogs,
          errorClientLogs,
          status: criticalSecurityLogs > 10 || errorClientLogs > 50 ? 'warning' : 'healthy',
        },
      },
    });
  } catch (err) {
    logError('Get platform stats error', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch platform statistics',
      error: err.message,
    });
  }
};

/**
 * Delete (soft delete) a login attempt
 */
export const deleteLoginAttempt = async (req, res) => {
  try {
    const { id } = req.params;

    const attempt = await LoginAttempt.findById(id);
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Login attempt not found',
      });
    }

    attempt.status = 'deleted';
    await attempt.save();

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    await logAuditEvent(
      'delete',
      'LoginAttempt',
      {
        userId: req.user._id,
        resourceId: id,
        description: `Deleted login attempt for ${attempt.email}`,
      },
      req
    );

    res.json({
      success: true,
      message: 'Login attempt deleted successfully',
    });
  } catch (err) {
    logError('Delete login attempt error', err);
    res.status(500).json({
      success: false,
      message: 'Could not delete login attempt',
      error: err.message,
    });
  }
};

/**
 * Delete (soft delete) a security log
 */
export const deleteSecurityLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await SecurityLog.findById(id);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Security log not found',
      });
    }

    log.status = 'deleted';
    await log.save();

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    await logAuditEvent(
      'delete',
      'SecurityLog',
      {
        userId: req.user._id,
        resourceId: id,
        description: `Deleted security log: ${log.eventType} (${log.severity})`,
      },
      req
    );

    res.json({
      success: true,
      message: 'Security log deleted successfully',
    });
  } catch (err) {
    logError('Delete security log error', err);
    res.status(500).json({
      success: false,
      message: 'Could not delete security log',
      error: err.message,
    });
  }
};

/**
 * Delete (soft delete) an audit log
 */
export const deleteAuditLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await AuditLog.findById(id);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found',
      });
    }

    log.status = 'deleted';
    await log.save();

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    await logAuditEvent(
      'delete',
      'AuditLog',
      {
        userId: req.user._id,
        resourceId: id,
        description: `Deleted audit log: ${log.action} on ${log.resourceType}`,
      },
      req
    );

    res.json({
      success: true,
      message: 'Audit log deleted successfully',
    });
  } catch (err) {
    logError('Delete audit log error', err);
    res.status(500).json({
      success: false,
      message: 'Could not delete audit log',
      error: err.message,
    });
  }
};

/**
 * Delete (soft delete) a client log
 */
export const deleteClientLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await ClientLog.findById(id);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Client log not found',
      });
    }

    log.status = 'deleted';
    await log.save();

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    await logAuditEvent(
      'delete',
      'ClientLog',
      {
        userId: req.user._id,
        resourceId: id,
        description: `Deleted client log: ${log.eventType} (${log.severity})`,
      },
      req
    );

    res.json({
      success: true,
      message: 'Client log deleted successfully',
    });
  } catch (err) {
    logError('Delete client log error', err);
    res.status(500).json({
      success: false,
      message: 'Could not delete client log',
      error: err.message,
    });
  }
};

/**
 * Bulk delete login attempts by date range
 */
export const bulkDeleteLoginAttempts = async (req, res) => {
  try {
    const { days, startDate, endDate } = req.query;
    
    let query = {
      status: { $ne: 'deleted' },
    };

    // If custom date range is provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      
      query.timestamp = {
        $gte: start,
        $lte: end,
      };
    } else if (days !== undefined) {
      // Use days parameter (for preset options)
      const daysNum = parseInt(days, 10);
      
      if (daysNum < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid days parameter',
        });
      }

      const cutoffDate = new Date();
      if (daysNum > 0) {
        cutoffDate.setDate(cutoffDate.getDate() - daysNum);
      }
      cutoffDate.setHours(0, 0, 0, 0);

      query.timestamp = { $gte: cutoffDate };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either days or startDate/endDate must be provided',
      });
    }

    const result = await LoginAttempt.updateMany(
      query,
      {
        $set: { status: 'deleted' },
      }
    );

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    const description = startDate && endDate
      ? `Bulk deleted ${result.modifiedCount} login attempts from ${startDate} to ${endDate}`
      : `Bulk deleted ${result.modifiedCount} login attempts from past ${days} day(s)`;
    
    await logAuditEvent(
      'delete',
      'LoginAttempt',
      {
        userId: req.user._id,
        description,
      },
      req
    );

    res.json({
      success: true,
      message: `Successfully deleted ${result.modifiedCount} login attempt(s)`,
      deletedCount: result.modifiedCount,
    });
  } catch (err) {
    logError('Bulk delete login attempts error', err);
    res.status(500).json({
      success: false,
      message: 'Could not bulk delete login attempts',
      error: err.message,
    });
  }
};

/**
 * Bulk delete security logs by date range
 */
export const bulkDeleteSecurityLogs = async (req, res) => {
  try {
    const { days, startDate, endDate } = req.query;
    
    let query = {
      status: { $ne: 'deleted' },
    };

    // If custom date range is provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      
      query.timestamp = {
        $gte: start,
        $lte: end,
      };
    } else if (days !== undefined) {
      // Use days parameter (for preset options)
      const daysNum = parseInt(days, 10);
      
      if (daysNum < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid days parameter',
        });
      }

      const cutoffDate = new Date();
      if (daysNum > 0) {
        cutoffDate.setDate(cutoffDate.getDate() - daysNum);
      }
      cutoffDate.setHours(0, 0, 0, 0);

      query.timestamp = { $gte: cutoffDate };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either days or startDate/endDate must be provided',
      });
    }

    const result = await SecurityLog.updateMany(
      query,
      {
        $set: { status: 'deleted' },
      }
    );

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    const description = startDate && endDate
      ? `Bulk deleted ${result.modifiedCount} security logs from ${startDate} to ${endDate}`
      : `Bulk deleted ${result.modifiedCount} security logs from past ${days} day(s)`;
    
    await logAuditEvent(
      'delete',
      'SecurityLog',
      {
        userId: req.user._id,
        description,
      },
      req
    );

    res.json({
      success: true,
      message: `Successfully deleted ${result.modifiedCount} security log(s)`,
      deletedCount: result.modifiedCount,
    });
  } catch (err) {
    logError('Bulk delete security logs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not bulk delete security logs',
      error: err.message,
    });
  }
};

/**
 * Bulk delete audit logs by date range
 */
export const bulkDeleteAuditLogs = async (req, res) => {
  try {
    const { days, startDate, endDate } = req.query;
    
    let query = {
      status: { $ne: 'deleted' },
    };

    // If custom date range is provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      
      query.timestamp = {
        $gte: start,
        $lte: end,
      };
    } else if (days !== undefined) {
      // Use days parameter (for preset options)
      const daysNum = parseInt(days, 10);
      
      if (daysNum < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid days parameter',
        });
      }

      const cutoffDate = new Date();
      if (daysNum > 0) {
        cutoffDate.setDate(cutoffDate.getDate() - daysNum);
      }
      cutoffDate.setHours(0, 0, 0, 0);

      query.timestamp = { $gte: cutoffDate };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either days or startDate/endDate must be provided',
      });
    }

    const result = await AuditLog.updateMany(
      query,
      {
        $set: { status: 'deleted' },
      }
    );

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    const description = startDate && endDate
      ? `Bulk deleted ${result.modifiedCount} audit logs from ${startDate} to ${endDate}`
      : `Bulk deleted ${result.modifiedCount} audit logs from past ${days} day(s)`;
    
    await logAuditEvent(
      'delete',
      'AuditLog',
      {
        userId: req.user._id,
        description,
      },
      req
    );

    res.json({
      success: true,
      message: `Successfully deleted ${result.modifiedCount} audit log(s)`,
      deletedCount: result.modifiedCount,
    });
  } catch (err) {
    logError('Bulk delete audit logs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not bulk delete audit logs',
      error: err.message,
    });
  }
};

/**
 * Bulk delete client logs by date range
 */
export const bulkDeleteClientLogs = async (req, res) => {
  try {
    const { days, startDate, endDate } = req.query;
    
    let query = {
      status: { $ne: 'deleted' },
    };

    // If custom date range is provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      
      query.timestamp = {
        $gte: start,
        $lte: end,
      };
    } else if (days !== undefined) {
      // Use days parameter (for preset options)
      const daysNum = parseInt(days, 10);
      
      if (daysNum < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid days parameter',
        });
      }

      const cutoffDate = new Date();
      if (daysNum > 0) {
        cutoffDate.setDate(cutoffDate.getDate() - daysNum);
      }
      cutoffDate.setHours(0, 0, 0, 0);

      query.timestamp = { $gte: cutoffDate };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either days or startDate/endDate must be provided',
      });
    }

    const result = await ClientLog.updateMany(
      query,
      {
        $set: { status: 'deleted' },
      }
    );

    // Log the action
    const { logAuditEvent } = await import('../utils/logger.js');
    const description = startDate && endDate
      ? `Bulk deleted ${result.modifiedCount} client logs from ${startDate} to ${endDate}`
      : `Bulk deleted ${result.modifiedCount} client logs from past ${days} day(s)`;
    
    await logAuditEvent(
      'delete',
      'ClientLog',
      {
        userId: req.user._id,
        description,
      },
      req
    );

    res.json({
      success: true,
      message: `Successfully deleted ${result.modifiedCount} client log(s)`,
      deletedCount: result.modifiedCount,
    });
  } catch (err) {
    logError('Bulk delete client logs error', err);
    res.status(500).json({
      success: false,
      message: 'Could not bulk delete client logs',
      error: err.message,
    });
  }
};

