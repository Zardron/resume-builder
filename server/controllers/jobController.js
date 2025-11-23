import JobPosting from '../models/JobPosting.js';
import Application from '../models/Application.js';

/**
 * Get all jobs (filtered by user role)
 */
export const getJobs = async (req, res) => {
  try {
    const { organizationId, status, location, employmentType, experienceLevel, search } = req.query;
    const user = req.user;

    const query = {};

    // If user is recruiter, filter by their organization
    if (user.organizationId) {
      query.organizationId = user.organizationId;
    } else if (organizationId) {
      query.organizationId = organizationId;
    }

    // If user is applicant, only show active jobs
    if (user.userType === 'applicant' || !user.organizationId) {
      query.status = 'active';
    } else if (status) {
      query.status = status;
    }

    if (location) {
      query['location.type'] = location;
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const jobs = await JobPosting.find(query)
      .populate('organizationId', 'name logo')
      .populate('postedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 50)
      .skip(parseInt(req.query.skip) || 0);

    const total = await JobPosting.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        limit: parseInt(req.query.limit) || 50,
        skip: parseInt(req.query.skip) || 0,
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jobs',
      error: error.message,
    });
  }
};

/**
 * Get single job
 */
export const getJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
      .populate('organizationId', 'name logo website industry')
      .populate('postedBy', 'fullName profile.avatar');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment view count
    job.viewCount += 1;
    await job.save();

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job',
      error: error.message,
    });
  }
};

/**
 * Create job posting
 */
export const createJob = async (req, res) => {
  try {
    const user = req.user;

    if (!user.organizationId) {
      return res.status(400).json({
        success: false,
        message: 'User must belong to an organization to post jobs',
      });
    }

    const jobData = {
      ...req.body,
      organizationId: user.organizationId,
      postedBy: user._id,
    };

    // If status is active, set publishedAt
    if (jobData.status === 'active') {
      jobData.publishedAt = new Date();
    }

    const job = new JobPosting(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: job,
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job posting',
      error: error.message,
    });
  }
};

/**
 * Update job posting
 */
export const updateJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check organization access
    if (job.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'organizationId' && key !== 'postedBy') {
        job[key] = req.body[key];
      }
    });

    // If status changed to active and not published, set publishedAt
    if (req.body.status === 'active' && !job.publishedAt) {
      job.publishedAt = new Date();
    }

    await job.save();

    res.json({
      success: true,
      message: 'Job posting updated successfully',
      data: job,
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job posting',
      error: error.message,
    });
  }
};

/**
 * Delete/Archive job posting
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check organization access
    if (job.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Instead of deleting, archive it
    job.status = 'archived';
    await job.save();

    res.json({
      success: true,
      message: 'Job posting archived successfully',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job posting',
      error: error.message,
    });
  }
};

/**
 * Duplicate job posting
 */
export const duplicateJob = async (req, res) => {
  try {
    const originalJob = await JobPosting.findById(req.params.id);

    if (!originalJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check organization access
    if (originalJob.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Create duplicate
    const jobData = originalJob.toObject();
    delete jobData._id;
    delete jobData.createdAt;
    delete jobData.updatedAt;
    delete jobData.publishedAt;
    delete jobData.applicationCount;
    delete jobData.viewCount;

    jobData.title = `${jobData.title} (Copy)`;
    jobData.status = 'draft';
    jobData.postedBy = req.user._id;

    const newJob = new JobPosting(jobData);
    await newJob.save();

    res.status(201).json({
      success: true,
      message: 'Job posting duplicated successfully',
      data: newJob,
    });
  } catch (error) {
    console.error('Duplicate job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate job posting',
      error: error.message,
    });
  }
};

/**
 * Get job analytics
 */
export const getJobAnalytics = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check organization access
    if (job.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const applications = await Application.find({ jobPostingId: job._id });
    const applicationsByStatus = {};

    applications.forEach(app => {
      applicationsByStatus[app.status] = (applicationsByStatus[app.status] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        job,
        totalApplications: applications.length,
        applicationsByStatus,
        viewCount: job.viewCount,
        conversionRate: job.viewCount > 0 ? (applications.length / job.viewCount * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    console.error('Get job analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job analytics',
      error: error.message,
    });
  }
};

/**
 * Publish job
 */
export const publishJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check organization access
    if (job.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    job.status = 'active';
    job.publishedAt = new Date();
    await job.save();

    res.json({
      success: true,
      message: 'Job published successfully',
      data: job,
    });
  } catch (error) {
    console.error('Publish job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish job',
      error: error.message,
    });
  }
};

/**
 * Pause job
 */
export const pauseJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check organization access
    if (job.organizationId.toString() !== req.user.organizationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    job.status = 'paused';
    await job.save();

    res.json({
      success: true,
      message: 'Job paused successfully',
      data: job,
    });
  } catch (error) {
    console.error('Pause job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pause job',
      error: error.message,
    });
  }
};

