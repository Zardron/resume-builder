import JobPosting from '../models/JobPosting.js';
import Application from '../models/Application.js';
import { logError, logInfo } from '../utils/logger.js';
import { buildPagination, buildSort, buildSearchQuery, optimizedFind } from '../utils/queryOptimizer.js';

export const getJobs = async (req, res) => {
  try {
    const { organizationId, status, location, employmentType, experienceLevel, search } = req.query;
    const user = req.user;

    const query = {};

    if (user.organizationId) {
      query.organizationId = user.organizationId;
    } else if (organizationId) {
      query.organizationId = organizationId;
    }

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

    const { limit, skip } = buildPagination(req.query);
    const sort = buildSort(req.query.sortBy, req.query.sortOrder);
    
    if (search) {
      const searchQuery = buildSearchQuery(search, ['title', 'description']);
      Object.assign(query, searchQuery);
    }
    
    const jobs = await optimizedFind(JobPosting, query, {
      populate: [
        { path: 'organizationId', select: 'name logo' },
        { path: 'postedBy', select: 'fullName' },
      ],
      sort,
      limit,
      skip,
    });

    const total = await JobPosting.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        limit,
        skip,
        page: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logError('Get jobs error', error, { userId: req.user?._id, query: req.query });
    res.status(500).json({
      success: false,
      message: 'Could not load jobs',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

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

    job.viewCount += 1;
    await job.save();

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    logError('Get job error', error, { jobId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not load job',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

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

    if (jobData.status === 'active') {
      jobData.publishedAt = new Date();
    }

    const job = new JobPosting(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job created',
      data: job,
    });
  } catch (error) {
    logError('Create job error', error, { userId: req.user?._id, organizationId: req.user?.organizationId });
    res.status(500).json({
      success: false,
      message: 'Could not create job',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

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

    Object.keys(req.body).forEach(key => {
      if (key !== 'organizationId' && key !== 'postedBy') {
        job[key] = req.body[key];
      }
    });

    if (req.body.status === 'active' && !job.publishedAt) {
      job.publishedAt = new Date();
    }

    await job.save();

    res.json({
      success: true,
      message: 'Job updated',
      data: job,
    });
  } catch (error) {
    logError('Update job error', error, { jobId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not update job',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

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

    job.status = 'archived';
    await job.save();

    res.json({
      success: true,
      message: 'Job archived',
    });
  } catch (error) {
    logError('Delete job error', error, { jobId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not archive job',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

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
      message: 'Job duplicated',
      data: newJob,
    });
  } catch (error) {
    logError('Duplicate job error', error, { jobId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not duplicate job',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

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
    logError('Get job analytics error', error, { jobId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not load analytics',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

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
      message: 'Job published',
      data: job,
    });
  } catch (error) {
    logError('Publish job error', error, { jobId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not publish job',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

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
      message: 'Job paused',
      data: job,
    });
  } catch (error) {
    logError('Pause job error', error, { jobId: req.params.id, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Could not pause job',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

