import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

/**
 * Get all interviews
 */
export const getInterviews = async (req, res) => {
  try {
    const user = req.user;
    const { status, organizationId, applicationId } = req.query;

    const query = {};

    // Applicants see their own interviews
    if (user.userType === 'applicant' || !user.organizationId) {
      query.applicantId = user._id;
    } else {
      // Recruiters see interviews for their organization
      query.organizationId = user.organizationId;
    }

    if (status) {
      query.status = status;
    }

    if (organizationId && user.organizationId?.toString() === organizationId) {
      query.organizationId = organizationId;
    }

    if (applicationId) {
      query.applicationId = applicationId;
    }

    const interviews = await Interview.find(query)
      .populate('applicationId', 'status')
      .populate('jobPostingId', 'title')
      .populate('applicantId', 'fullName email')
      .populate('interviewers.userId', 'fullName email profile.avatar')
      .populate('organizationId', 'name')
      .sort({ scheduledAt: 1 })
      .limit(parseInt(req.query.limit) || 50)
      .skip(parseInt(req.query.skip) || 0);

    const total = await Interview.countDocuments(query);

    res.json({
      success: true,
      data: interviews,
      pagination: {
        total,
        limit: parseInt(req.query.limit) || 50,
        skip: parseInt(req.query.skip) || 0,
      },
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get interviews',
      error: error.message,
    });
  }
};

/**
 * Get single interview
 */
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('applicationId')
      .populate('jobPostingId')
      .populate('applicantId')
      .populate('interviewers.userId')
      .populate('organizationId');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check access
    const user = req.user;
    if (user.userType === 'applicant' || !user.organizationId) {
      if (interview.applicantId.toString() !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    } else {
      if (interview.organizationId.toString() !== user.organizationId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    }

    res.json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get interview',
      error: error.message,
    });
  }
};

/**
 * Create interview
 */
export const createInterview = async (req, res) => {
  try {
    const {
      applicationId,
      interviewers,
      type,
      scheduledAt,
      duration,
      timezone,
      location,
      meetingLink,
      notes,
    } = req.body;

    // Validate
    if (!applicationId || !type || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Application ID, type, and scheduled time are required',
      });
    }

    // Get application
    const application = await Application.findById(applicationId)
      .populate('jobPostingId')
      .populate('organizationId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check organization access
    if (application.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Create interview
    const interview = new Interview({
      applicationId,
      jobPostingId: application.jobPostingId._id,
      applicantId: application.applicantId,
      organizationId: application.organizationId._id,
      interviewers: interviewers || [{ userId: req.user._id, role: 'primary' }],
      type,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 60,
      timezone: timezone || 'UTC',
      location,
      meetingLink,
      notes,
      status: 'scheduled',
    });

    await interview.save();

    // Update application status
    application.status = 'interview';
    await application.save();

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: error.message,
    });
  }
};

/**
 * Update interview
 */
export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check organization access
    if (interview.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update fields
    const allowedUpdates = ['type', 'scheduledAt', 'duration', 'timezone', 'location', 'meetingLink', 'notes', 'interviewers'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'scheduledAt') {
          interview[field] = new Date(req.body[field]);
        } else {
          interview[field] = req.body[field];
        }
      }
    });

    await interview.save();

    res.json({
      success: true,
      message: 'Interview updated successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      error: error.message,
    });
  }
};

/**
 * Confirm interview (applicant)
 */
export const confirmInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if user is the applicant
    if (interview.applicantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    interview.status = 'confirmed';
    await interview.save();

    res.json({
      success: true,
      message: 'Interview confirmed successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Confirm interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm interview',
      error: error.message,
    });
  }
};

/**
 * Reschedule interview
 */
export const rescheduleInterview = async (req, res) => {
  try {
    const { scheduledAt, reason } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check access
    const user = req.user;
    const isApplicant = interview.applicantId.toString() === user._id.toString();
    const isRecruiter = interview.organizationId.toString() === user.organizationId?.toString();

    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    interview.rescheduledFrom = interview.scheduledAt;
    interview.scheduledAt = new Date(scheduledAt);
    interview.status = 'rescheduled';
    if (reason) interview.notes = (interview.notes || '') + `\nReschedule reason: ${reason}`;

    await interview.save();

    res.json({
      success: true,
      message: 'Interview rescheduled successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Reschedule interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule interview',
      error: error.message,
    });
  }
};

/**
 * Cancel interview
 */
export const cancelInterview = async (req, res) => {
  try {
    const { reason } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check access
    const user = req.user;
    const isApplicant = interview.applicantId.toString() === user._id.toString();
    const isRecruiter = interview.organizationId.toString() === user.organizationId?.toString();

    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    interview.status = 'cancelled';
    interview.cancelledReason = reason;
    await interview.save();

    res.json({
      success: true,
      message: 'Interview cancelled successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Cancel interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel interview',
      error: error.message,
    });
  }
};

/**
 * Delete interview
 */
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check organization access
    if (interview.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Only allow deletion if not completed
    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete completed interview',
      });
    }

    await Interview.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error: error.message,
    });
  }
};

/**
 * Submit interview feedback
 */
export const submitFeedback = async (req, res) => {
  try {
    const { rating, notes, recommendation } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check organization access
    if (interview.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if interviewer is in the list
    const isInterviewer = interview.interviewers.some(
      i => i.userId.toString() === req.user._id.toString()
    );

    if (!isInterviewer) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned as an interviewer',
      });
    }

    // Check if feedback already exists
    const existingFeedback = interview.feedback.find(
      f => f.interviewerId.toString() === req.user._id.toString()
    );

    if (existingFeedback) {
      // Update existing feedback
      existingFeedback.rating = rating;
      existingFeedback.notes = notes;
      existingFeedback.recommendation = recommendation;
      existingFeedback.submittedAt = new Date();
    } else {
      // Add new feedback
      interview.feedback.push({
        interviewerId: req.user._id,
        rating,
        notes,
        recommendation,
      });
    }

    // Mark as completed if all interviewers have submitted feedback
    const allFeedbackSubmitted = interview.interviewers.every(interviewer =>
      interview.feedback.some(f => f.interviewerId.toString() === interviewer.userId.toString())
    );

    if (allFeedbackSubmitted && interview.status === 'confirmed') {
      interview.status = 'completed';
    }

    await interview.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message,
    });
  }
};

/**
 * Get calendar events (upcoming interviews)
 */
export const getCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.params.userId;

    // Check if user can access this calendar
    if (req.user._id.toString() !== userId && req.user.organizationId) {
      // Check if user is in same organization
      const user = await User.findById(userId);
      if (user.organizationId?.toString() !== req.user.organizationId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    }

    const query = {
      $or: [
        { applicantId: userId },
        { 'interviewers.userId': userId },
      ],
      status: { $in: ['scheduled', 'confirmed'] },
    };

    if (startDate && endDate) {
      query.scheduledAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const interviews = await Interview.find(query)
      .populate('jobPostingId', 'title')
      .populate('applicantId', 'fullName email')
      .populate('interviewers.userId', 'fullName email')
      .sort({ scheduledAt: 1 });

    res.json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calendar',
      error: error.message,
    });
  }
};

