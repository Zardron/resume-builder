import Analytics from '../models/Analytics.js';
import JobPosting from '../models/JobPosting.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import TeamMember from '../models/TeamMember.js';
import Message from '../models/Message.js';
import { logError } from '../utils/logger.js';

// Get analytics overview
export const getOverview = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get jobs metrics
    const totalJobs = await JobPosting.countDocuments({ organizationId });
    const activeJobs = await JobPosting.countDocuments({ organizationId, status: 'active' });
    const totalJobViews = await JobPosting.aggregate([
      { $match: { organizationId } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } },
    ]);

    // Get applications metrics
    const totalApplications = await Application.countDocuments({ organizationId, ...dateFilter });
    const applicationsByStatus = await Application.aggregate([
      { $match: { organizationId, ...dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get candidates metrics
    const uniqueCandidates = await Application.distinct('applicantId', { organizationId, ...dateFilter });
    const hiredCandidates = await Application.countDocuments({
      organizationId,
      status: 'offer',
      ...dateFilter,
    });

    // Get interviews metrics
    const totalInterviews = await Interview.countDocuments({ organizationId, ...dateFilter });
    const completedInterviews = await Interview.countDocuments({
      organizationId,
      status: 'completed',
      ...dateFilter,
    });

    // Get team metrics
    const activeRecruiters = await TeamMember.countDocuments({
      organizationId,
      status: 'active',
    });

    // Calculate time to hire
    const timeToHireData = await Application.aggregate([
      {
        $match: {
          organizationId,
          status: 'offer',
          appliedAt: { $exists: true },
          updatedAt: { $exists: true },
        },
      },
      {
        $project: {
          days: {
            $divide: [
              { $subtract: ['$updatedAt', '$appliedAt'] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$days' },
        },
      },
    ]);

    const averageTimeToHire = timeToHireData[0]?.average || 0;

    res.json({
      success: true,
      data: {
        jobs: {
          total: totalJobs,
          active: activeJobs,
          totalViews: totalJobViews[0]?.total || 0,
        },
        applications: {
          total: totalApplications,
          byStatus: applicationsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
        candidates: {
          total: uniqueCandidates.length,
          hired: hiredCandidates,
          inPipeline: totalApplications - hiredCandidates,
        },
        interviews: {
          total: totalInterviews,
          completed: completedInterviews,
        },
        team: {
          activeRecruiters,
        },
        metrics: {
          averageTimeToHire: Math.round(averageTimeToHire),
          applicationToInterviewRate: totalApplications > 0
            ? ((totalInterviews / totalApplications) * 100).toFixed(2)
            : 0,
          interviewToOfferRate: totalInterviews > 0
            ? ((hiredCandidates / totalInterviews) * 100).toFixed(2)
            : 0,
        },
      },
    });
  } catch (error) {
    logError('Get analytics overview error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics overview',
      error: error.message,
    });
  }
};

// Get hiring funnel
export const getHiringFunnel = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.appliedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const funnel = await Application.aggregate([
      { $match: { organizationId, ...dateFilter } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const funnelData = {
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };

    funnel.forEach(item => {
      if (funnelData.hasOwnProperty(item._id)) {
        funnelData[item._id] = item.count;
      }
    });

    // Calculate conversion rates
    const total = funnelData.applied;
    const conversionRates = {
      applied: 100,
      screening: total > 0 ? ((funnelData.screening / total) * 100).toFixed(2) : 0,
      interview: total > 0 ? ((funnelData.interview / total) * 100).toFixed(2) : 0,
      offer: total > 0 ? ((funnelData.offer / total) * 100).toFixed(2) : 0,
    };

    res.json({
      success: true,
      data: {
        funnel: funnelData,
        conversionRates,
      },
    });
  } catch (error) {
    logError('Get hiring funnel error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get hiring funnel',
      error: error.message,
    });
  }
};

// Get time to hire analytics
export const getTimeToHire = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { startDate, endDate } = req.query;

    const matchFilter = { organizationId, status: 'offer' };
    if (startDate && endDate) {
      matchFilter.appliedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const timeToHireData = await Application.aggregate([
      { $match: matchFilter },
      {
        $project: {
          days: {
            $divide: [
              { $subtract: ['$updatedAt', '$appliedAt'] },
              1000 * 60 * 60 * 24,
            ],
          },
          month: { $month: '$appliedAt' },
          year: { $year: '$appliedAt' },
        },
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          average: { $avg: '$days' },
          min: { $min: '$days' },
          max: { $max: '$days' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      data: timeToHireData,
    });
  } catch (error) {
    logError('Get time to hire error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get time to hire analytics',
      error: error.message,
    });
  }
};

// Get source analytics
export const getSourceAnalytics = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.appliedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const sourceData = await Application.aggregate([
      { $match: { organizationId, ...dateFilter } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          hired: {
            $sum: {
              $cond: [{ $eq: ['$status', 'offer'] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: sourceData,
    });
  } catch (error) {
    logError('Get source analytics error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get source analytics',
      error: error.message,
    });
  }
};

// Get team performance
export const getTeamPerformance = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get team members
    const teamMembers = await TeamMember.find({
      organizationId,
      status: 'active',
    }).populate('userId', 'fullName email');

    const performanceData = await Promise.all(
      teamMembers.map(async (member) => {
        const jobsPosted = await JobPosting.countDocuments({
          organizationId,
          postedBy: member.userId,
          ...dateFilter,
        });

        const applicationsReviewed = await Application.countDocuments({
          organizationId,
          'recruiterNotes.recruiterId': member.userId,
          ...dateFilter,
        });

        const interviewsScheduled = await Interview.countDocuments({
          organizationId,
          'interviewers.userId': member.userId,
          ...dateFilter,
        });

        const messagesSent = await Message.countDocuments({
          senderId: member.userId,
          senderRole: 'recruiter',
          ...dateFilter,
        });

        return {
          userId: member.userId._id,
          name: member.userId.fullName,
          email: member.userId.email,
          role: member.role,
          metrics: {
            jobsPosted,
            applicationsReviewed,
            interviewsScheduled,
            messagesSent,
          },
        };
      })
    );

    res.json({
      success: true,
      data: performanceData,
    });
  } catch (error) {
    logError('Get team performance error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get team performance',
      error: error.message,
    });
  }
};

// Get job performance
export const getJobPerformance = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.publishedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const jobs = await JobPosting.find({
      organizationId,
      ...dateFilter,
    }).select('title status viewCount applicationCount publishedAt');

    const jobPerformance = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.countDocuments({
          jobPostingId: job._id,
        });

        const hired = await Application.countDocuments({
          jobPostingId: job._id,
          status: 'offer',
        });

        return {
          jobId: job._id,
          title: job.title,
          status: job.status,
          views: job.viewCount,
          applications,
          hired,
          conversionRate: job.viewCount > 0
            ? ((applications / job.viewCount) * 100).toFixed(2)
            : 0,
          hireRate: applications > 0
            ? ((hired / applications) * 100).toFixed(2)
            : 0,
        };
      })
    );

    res.json({
      success: true,
      data: jobPerformance,
    });
  } catch (error) {
    logError('Get job performance error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get job performance',
      error: error.message,
    });
  }
};

