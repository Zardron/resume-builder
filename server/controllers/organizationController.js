import Organization from '../models/Organization.js';
import TeamMember from '../models/TeamMember.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Message from '../models/Message.js';

export const createOrganization = async (req, res) => {
  try {
    const { name, industry, size, website, logo } = req.body;
    const user = req.user;

    if (user.organizationId) {
      return res.status(400).json({
        success: false,
        message: 'User already belongs to an organization',
      });
    }

    const organization = new Organization({
      name,
      industry,
      size,
      website,
      logo,
      subscription: {
        plan: 'starter',
        status: 'trial',
        seats: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    await organization.save();

    user.organizationId = organization._id;
    user.userType = user.userType === 'applicant' ? 'both' : 'recruiter';
    await user.save();

    const teamMember = new TeamMember({
      organizationId: organization._id,
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

    res.status(201).json({
      success: true,
      message: 'Organization created',
      data: {
        organization,
        teamMember,
      },
    });
  } catch (error) {
    logError('Create organization error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not create organization',
      error: error.message,
    });
  }
};

export const getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    logError('Get organization error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not fetch organization',
      error: error.message,
    });
  }
};

// Update organization
export const updateOrganization = async (req, res) => {
  try {
    const { name, industry, size, website, logo, settings } = req.body;
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    if (name) organization.name = name;
    if (industry) organization.industry = industry;
    if (size) organization.size = size;
    if (website) organization.website = website;
    if (logo) organization.logo = logo;
    if (settings) {
      organization.settings = { ...organization.settings, ...settings };
    }

    await organization.save();

    res.json({
      success: true,
      message: 'Organization updated',
      data: organization,
    });
  } catch (error) {
    logError('Update organization error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not update organization',
      error: error.message,
    });
  }
};

// Get organization team members
export const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({
      organizationId: req.params.orgId,
    })
      .populate('userId', 'fullName email profile.avatar')
      .populate('invitedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    logError('Get team members error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not fetch team members',
      error: error.message,
    });
  }
};

// Invite team member
export const inviteTeamMember = async (req, res) => {
  try {
    const { email, role, department, permissions } = req.body;
    const organizationId = req.params.orgId;

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found. Please ask them to register first.',
      });
    }

    // Check if already a team member
    const existingMember = await TeamMember.findOne({
      organizationId,
      userId: user._id,
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member',
      });
    }

    // Create team member
    const teamMember = new TeamMember({
      organizationId,
      userId: user._id,
      role: role || 'recruiter',
      department,
      permissions: permissions || {
        canPostJobs: true,
        canViewAllCandidates: true,
        canManageTeam: false,
        canViewAnalytics: true,
        canManageBilling: false,
      },
      invitedBy: req.user._id,
      status: 'pending',
    });

    await teamMember.save();

    // Update user's organizationId if not set
    if (!user.organizationId) {
      user.organizationId = organizationId;
      user.userType = user.userType === 'applicant' ? 'both' : 'recruiter';
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Team member invited',
      data: teamMember,
    });
  } catch (error) {
    logError('Invite team member error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not invite team member',
      error: error.message,
    });
  }
};

// Update team member role
export const updateTeamMemberRole = async (req, res) => {
  try {
    const { role, permissions } = req.body;
    const teamMember = await TeamMember.findById(req.params.memberId);

    if (!teamMember || teamMember.organizationId.toString() !== req.params.orgId) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    if (role) teamMember.role = role;
    if (permissions) {
      teamMember.permissions = { ...teamMember.permissions, ...permissions };
    }

    await teamMember.save();

    res.json({
      success: true,
      message: 'Team member updated',
      data: teamMember,
    });
  } catch (error) {
    logError('Update team member error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not update team member',
      error: error.message,
    });
  }
};

// Remove team member
export const removeTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.memberId);

    if (!teamMember || teamMember.organizationId.toString() !== req.params.orgId) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    // Don't allow removing the last admin
    if (teamMember.role === 'admin') {
      const adminCount = await TeamMember.countDocuments({
        organizationId: req.params.orgId,
        role: 'admin',
        status: 'active',
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove the last admin',
        });
      }
    }

    teamMember.status = 'inactive';
    await teamMember.save();

    res.json({
      success: true,
      message: 'Team member removed',
    });
  } catch (error) {
    logError('Remove team member error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not remove team member',
      error: error.message,
    });
  }
};

// Get team activity
export const getTeamActivity = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const organizationId = req.params.orgId;

    // Get recent applications
    const recentApplications = await Application.find({ organizationId })
      .populate('applicantId', 'fullName email')
      .populate('jobPostingId', 'title')
      .populate('organizationId', 'name')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    // Get recent interviews
    const recentInterviews = await Interview.find({ organizationId })
      .populate('applicantId', 'fullName')
      .populate('jobPostingId', 'title')
      .sort({ scheduledAt: -1 })
      .limit(parseInt(limit));

    // Get recent messages
    const teamMembers = await TeamMember.find({ organizationId, status: 'active' });
    const userIds = teamMembers.map(tm => tm.userId);

    const recentMessages = await Message.find({
      senderRole: 'recruiter',
      senderId: { $in: userIds },
    })
      .populate('senderId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        applications: recentApplications,
        interviews: recentInterviews,
        messages: recentMessages,
      },
    });
  } catch (error) {
    logError('Get team activity error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not fetch team activity',
      error: error.message,
    });
  }
};

