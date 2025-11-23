import Application from '../models/Application.js';
import JobPosting from '../models/JobPosting.js';
import Interview from '../models/Interview.js';
import TeamMember from '../models/TeamMember.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// ==================== RECRUITER DASHBOARD ====================

/**
 * Get recruiter dashboard stats
 */
export const getRecruiterStats = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;

    // Get quick stats
    const activeJobs = await JobPosting.countDocuments({
      organizationId,
      status: 'active',
    });

    const totalApplications = await Application.countDocuments({ organizationId });
    const newApplications = await Application.countDocuments({
      organizationId,
      status: 'applied',
      appliedAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    });

    const upcomingInterviews = await Interview.countDocuments({
      organizationId,
      status: { $in: ['scheduled', 'confirmed'] },
      scheduledAt: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
      },
    });

    const offersSent = await Application.countDocuments({
      organizationId,
      status: 'offer',
    });

    res.json({
      success: true,
      data: {
        activeJobs,
        totalApplications,
        newApplications,
        upcomingInterviews,
        offersSent,
      },
    });
  } catch (error) {
    console.error('Get recruiter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recruiter stats',
      error: error.message,
    });
  }
};

/**
 * Get recruiter pipeline
 */
export const getRecruiterPipeline = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { jobPostingId } = req.query;

    const query = { organizationId };
    if (jobPostingId) {
      query.jobPostingId = jobPostingId;
    }

    const pipeline = await Application.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          applications: { $push: '$$ROOT' },
        },
      },
    ]);

    // Get applications by status
    const applicationsByStatus = {};
    for (const group of pipeline) {
      applicationsByStatus[group._id] = {
        count: group.count,
        applications: await Application.find({
          organizationId,
          status: group._id,
          ...(jobPostingId && { jobPostingId }),
        })
          .populate('applicantId', 'fullName email applicantProfile')
          .populate('resumeId', 'name')
          .populate('jobPostingId', 'title')
          .sort({ appliedAt: -1 })
          .limit(10),
      };
    }

    res.json({
      success: true,
      data: applicationsByStatus,
    });
  } catch (error) {
    console.error('Get recruiter pipeline error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recruiter pipeline',
      error: error.message,
    });
  }
};

/**
 * Get recruiter team activity
 */
export const getRecruiterActivity = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { limit = 20 } = req.query;

    // Get recent team member activities
    const teamMembers = await TeamMember.find({
      organizationId,
      status: 'active',
    }).populate('userId', 'fullName email');

    // Get recent applications
    const recentApplications = await Application.find({ organizationId })
      .populate('applicantId', 'fullName')
      .populate('jobPostingId', 'title')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    // Get recent interviews
    const recentInterviews = await Interview.find({ organizationId })
      .populate('applicantId', 'fullName')
      .populate('jobPostingId', 'title')
      .sort({ scheduledAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        teamMembers,
        recentApplications,
        recentInterviews,
      },
    });
  } catch (error) {
    console.error('Get recruiter activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recruiter activity',
      error: error.message,
    });
  }
};

/**
 * Get recruiter upcoming interviews
 */
export const getRecruiterUpcomingInterviews = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { days = 7 } = req.query;

    const upcomingInterviews = await Interview.find({
      organizationId,
      status: { $in: ['scheduled', 'confirmed'] },
      scheduledAt: {
        $gte: new Date(),
        $lte: new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000),
      },
    })
      .populate('applicationId', 'status')
      .populate('jobPostingId', 'title')
      .populate('applicantId', 'fullName email')
      .populate('interviewers.userId', 'fullName email profile.avatar')
      .sort({ scheduledAt: 1 });

    res.json({
      success: true,
      data: upcomingInterviews,
    });
  } catch (error) {
    console.error('Get upcoming interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upcoming interviews',
      error: error.message,
    });
  }
};

// ==================== APPLICANT DASHBOARD ====================

/**
 * Get applicant dashboard overview
 */
export const getApplicantOverview = async (req, res) => {
  try {
    const user = req.user;

    // Get applications summary
    const totalApplications = await Application.countDocuments({ applicantId: user._id });
    const applicationsByStatus = await Application.aggregate([
      { $match: { applicantId: user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get upcoming interviews
    const upcomingInterviews = await Interview.find({
      applicantId: user._id,
      status: { $in: ['scheduled', 'confirmed'] },
      scheduledAt: { $gte: new Date() },
    })
      .populate('jobPostingId', 'title organizationId')
      .populate('organizationId', 'name logo')
      .sort({ scheduledAt: 1 })
      .limit(5);

    // Get unread messages
    const conversations = await Conversation.find({
      'participants.userId': user._id,
    });
    let unreadMessages = 0;
    for (const conv of conversations) {
      const unread = conv.unreadCount.get(user._id.toString()) || 0;
      unreadMessages += unread;
    }

    // Profile completeness
    const profileCompleteness = calculateProfileCompleteness(user);

    res.json({
      success: true,
      data: {
        totalApplications,
        applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        upcomingInterviews,
        unreadMessages,
        profileCompleteness,
      },
    });
  } catch (error) {
    console.error('Get applicant overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applicant overview',
      error: error.message,
    });
  }
};

/**
 * Get recommended jobs for applicant
 */
export const getApplicantRecommendedJobs = async (req, res) => {
  try {
    const user = req.user;
    const { limit = 10 } = req.query;

    if (!user.applicantProfile) {
      return res.json({
        success: true,
        data: [],
        message: 'Complete your profile to get job recommendations',
      });
    }

    // Build query based on applicant profile
    const query = {
      status: 'active',
    };

    // Match preferred locations
    if (user.applicantProfile.preferredLocations?.length > 0) {
      query.$or = [
        { 'location.type': 'remote' },
        { 'location.city': { $in: user.applicantProfile.preferredLocations } },
      ];
    }

    // Match preferred job types
    if (user.applicantProfile.preferredJobTypes?.length > 0) {
      query.employmentType = { $in: user.applicantProfile.preferredJobTypes };
    }

    // Match skills
    if (user.applicantProfile.skills?.length > 0) {
      query.skills = { $in: user.applicantProfile.skills };
    }

    // Match experience level
    if (user.applicantProfile.experience) {
      if (user.applicantProfile.experience < 2) {
        query.experienceLevel = 'entry';
      } else if (user.applicantProfile.experience < 5) {
        query.experienceLevel = { $in: ['entry', 'mid'] };
      } else {
        query.experienceLevel = { $in: ['mid', 'senior'] };
      }
    }

    const jobs = await JobPosting.find(query)
      .populate('organizationId', 'name logo industry')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommended jobs',
      error: error.message,
    });
  }
};

/**
 * Get applicant applications
 */
export const getApplicantApplications = async (req, res) => {
  try {
    const user = req.user;
    const { status, limit = 50, skip = 0 } = req.query;

    const query = { applicantId: user._id };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('jobPostingId', 'title organizationId location')
      .populate('organizationId', 'name logo')
      .populate('resumeId', 'name')
      .sort({ appliedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    console.error('Get applicant applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applicant applications',
      error: error.message,
    });
  }
};

/**
 * Get applicant dashboard stats
 */
export const getApplicantStats = async (req, res) => {
  try {
    const user = req.user;

    const totalApplications = await Application.countDocuments({ applicantId: user._id });
    const activeApplications = await Application.countDocuments({
      applicantId: user._id,
      status: { $in: ['applied', 'screening', 'interview'] },
    });
    const interviewsScheduled = await Interview.countDocuments({
      applicantId: user._id,
      status: { $in: ['scheduled', 'confirmed'] },
      scheduledAt: { $gte: new Date() },
    });
    const offersReceived = await Application.countDocuments({
      applicantId: user._id,
      status: 'offer',
    });

    // Get application success rate
    const interviewsCompleted = await Interview.countDocuments({
      applicantId: user._id,
      status: 'completed',
    });

    const interviewToOfferRate = interviewsCompleted > 0
      ? ((offersReceived / interviewsCompleted) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        totalApplications,
        activeApplications,
        interviewsScheduled,
        offersReceived,
        interviewToOfferRate: parseFloat(interviewToOfferRate),
      },
    });
  } catch (error) {
    console.error('Get applicant stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applicant stats',
      error: error.message,
    });
  }
};

/**
 * Helper function to calculate profile completeness
 */
function calculateProfileCompleteness(user) {
  let completed = 0;
  let total = 0;

  // Basic info
  total += 3;
  if (user.fullName) completed++;
  if (user.email) completed++;
  if (user.profile?.avatar) completed++;

  // Applicant profile
  if (user.applicantProfile) {
    total += 6;
    if (user.applicantProfile.skills?.length > 0) completed++;
    if (user.applicantProfile.experience) completed++;
    if (user.applicantProfile.preferredLocations?.length > 0) completed++;
    if (user.applicantProfile.preferredJobTypes?.length > 0) completed++;
    if (user.applicantProfile.salaryExpectation?.min) completed++;
    if (user.applicantProfile.linkedInUrl) completed++;
  } else {
    total += 6;
  }

  return {
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    completed,
    total,
  };
}

