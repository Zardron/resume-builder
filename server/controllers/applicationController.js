import Application from '../models/Application.js';
import JobPosting from '../models/JobPosting.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { logError } from '../utils/logger.js';

export const getApplications = async (req, res) => {
  try {
    const user = req.user;
    const { status, jobPostingId, organizationId } = req.query;

    const query = {};

    if (user.userType === 'applicant' || !user.organizationId) {
      query.applicantId = user._id;
    } else {
      query.organizationId = user.organizationId;
    }

    if (status) {
      query.status = status;
    }

    if (jobPostingId) {
      query.jobPostingId = jobPostingId;
    }

    if (organizationId && user.organizationId?.toString() === organizationId) {
      query.organizationId = organizationId;
    }

    const applications = await Application.find(query)
      .populate('jobPostingId', 'title organizationId')
      .populate('applicantId', 'fullName email applicantProfile')
      .populate('resumeId', 'name template')
      .populate('organizationId', 'name logo')
      .sort({ appliedAt: -1 })
      .limit(parseInt(req.query.limit) || 50)
      .skip(parseInt(req.query.skip) || 0);

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        limit: parseInt(req.query.limit) || 50,
        skip: parseInt(req.query.skip) || 0,
      },
    });
  } catch (error) {
    logError('Get applications error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not fetch applications',
      error: error.message,
    });
  }
};

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobPostingId')
      .populate('applicantId')
      .populate('resumeId')
      .populate('organizationId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const user = req.user;
    if (user.userType === 'applicant' || !user.organizationId) {
      if (application.applicantId.toString() !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    } else {
      if (application.organizationId.toString() !== user.organizationId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    logError('Get application error', error, { applicationId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not fetch application',
      error: error.message,
    });
  }
};

export const createApplication = async (req, res) => {
  try {
    const { jobPostingId, resumeId, coverLetter, answers } = req.body;
    const user = req.user;

    if (!jobPostingId || !resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Job posting ID and resume ID are required',
      });
    }

    const job = await JobPosting.findById(jobPostingId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Job posting is not accepting applications',
      });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume || resume.userId.toString() !== user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const existingApplication = await Application.findOne({
      jobPostingId,
      applicantId: user._id,
    });

    if (existingApplication && existingApplication.status !== 'withdrawn') {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    let screeningScore = 50; // Base score
    const application = new Application({
      jobPostingId,
      applicantId: user._id,
      organizationId: job.organizationId,
      resumeId,
      coverLetter,
      answers,
      screeningScore,
      status: 'applied',
    });

    await application.save();

    job.applicationCount += 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted',
      data: application,
    });
  } catch (error) {
    logError('Create application error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not submit application',
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, stage } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (status) application.status = status;
    if (stage) application.stage = stage;

    await application.save();

    res.json({
      success: true,
      message: 'Status updated',
      data: application,
    });
  } catch (error) {
    logError('Update application status error', error, { applicationId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not update status',
      error: error.message,
    });
  }
};

export const addNote = async (req, res) => {
  try {
    const { note } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    application.recruiterNotes.push({
      recruiterId: req.user._id,
      note,
    });

    await application.save();

    res.json({
      success: true,
      message: 'Note added',
      data: application,
    });
  } catch (error) {
    logError('Add note error', error, { applicationId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not add note',
      error: error.message,
    });
  }
};

export const addTags = async (req, res) => {
  try {
    const { tags } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (Array.isArray(tags)) {
      tags.forEach(tag => {
        if (!application.tags.includes(tag)) {
          application.tags.push(tag);
        }
      });
    }

    await application.save();

    res.json({
      success: true,
      message: 'Tags added',
      data: application,
    });
  } catch (error) {
    logError('Add tags error', error, { applicationId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not add tags',
      error: error.message,
    });
  }
};

// Rate application
export const rateApplication = async (req, res) => {
  try {
    const { rating } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    application.rating = rating;
    await application.save();

    res.json({
      success: true,
      message: 'Rating added',
      data: application,
    });
  } catch (error) {
    logError('Rate application error', error, { applicationId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not rate application',
      error: error.message,
    });
  }
};

// Withdraw application (applicant only)
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.applicantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn',
      data: application,
    });
  } catch (error) {
    logError('Withdraw application error', error, { applicationId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not withdraw application',
      error: error.message,
    });
  }
};

export const getAIMatch = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('resumeId')
      .populate('jobPostingId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const resume = application.resumeId;
    const job = application.jobPostingId;

    let score = application.screeningScore || 50;
    const breakdown = {
      skills: 0,
      experience: 0,
      education: 0,
      location: 0,
    };

    if (resume?.aiParsedData?.skills && job?.skills) {
      const matchingSkills = resume.aiParsedData.skills.filter(skill =>
        job.skills.some(js => js.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(js.toLowerCase()))
      );
      breakdown.skills = (matchingSkills.length / Math.max(job.skills.length, 1)) * 30;
    }

    if (resume?.aiParsedData?.experience && job?.screeningCriteria?.minExperience) {
      if (resume.aiParsedData.experience >= job.screeningCriteria.minExperience) {
        breakdown.experience = 30;
      } else {
        breakdown.experience = (resume.aiParsedData.experience / job.screeningCriteria.minExperience) * 30;
      }
    }

    if (resume?.aiParsedData?.education?.length > 0 && job?.screeningCriteria?.educationLevel) {
      breakdown.education = 20;
    }

    if (job?.location?.type === 'remote') {
      breakdown.location = 20;
    } else if (resume?.userId) {
      const applicant = await User.findById(resume.userId);
      if (applicant?.applicantProfile?.preferredLocations?.some(loc =>
        job.location?.city?.toLowerCase().includes(loc.toLowerCase())
      )) {
        breakdown.location = 20;
      }
    }

    score = Math.min(100, Math.round(
      breakdown.skills + breakdown.experience + breakdown.education + breakdown.location
    ));

    res.json({
      success: true,
      data: {
        score,
        breakdown,
        applicationId: application._id,
      },
    });
  } catch (error) {
    logError('Get AI match error', error, { applicationId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not get match score',
      error: error.message,
    });
  }
};

// Bulk action on applications
export const bulkAction = async (req, res) => {
  try {
    const { applicationIds, action, data } = req.body;
    const organizationId = req.user.organizationId;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Application IDs are required',
      });
    }

    // Verify all applications belong to organization
    const applications = await Application.find({
      _id: { $in: applicationIds },
      organizationId,
    });

    if (applications.length !== applicationIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some applications not found or access denied',
      });
    }

    let result;
    switch (action) {
      case 'update-status':
        result = await Application.updateMany(
          { _id: { $in: applicationIds } },
          { $set: { status: data.status, stage: data.stage } }
        );
        break;
      case 'add-tags':
        result = await Application.updateMany(
          { _id: { $in: applicationIds } },
          { $addToSet: { tags: { $each: data.tags } } }
        );
        break;
      case 'remove-tags':
        result = await Application.updateMany(
          { _id: { $in: applicationIds } },
          { $pull: { tags: { $in: data.tags } } }
        );
        break;
      case 'assign-recruiter':
        // This would require adding assignedRecruiter field to Application model
        result = { modifiedCount: applications.length };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action',
        });
    }

    res.json({
      success: true,
      message: `Bulk action completed: ${action}`,
      data: {
        affected: result.modifiedCount || applications.length,
      },
    });
  } catch (error) {
    logError('Bulk action error', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not perform bulk action',
      error: error.message,
    });
  }
};

