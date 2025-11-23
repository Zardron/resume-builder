import express from 'express';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all resumes for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-resumeData'); // Don't send full data in list

    res.json({
      success: true,
      data: { resumes },
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
      error: error.message,
    });
  }
});

// Get single resume
router.get('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.json({
      success: true,
      data: { resume },
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error.message,
    });
  }
});

// Create new resume
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, template, resumeData, settings } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Resume name is required',
      });
    }

    const resume = new Resume({
      userId: req.user._id,
      name,
      template: template || 'modern',
      resumeData: resumeData || {},
      settings: settings || {},
    });

    await resume.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.resumesCreated': 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: { resume },
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resume',
      error: error.message,
    });
  }
});

// Update resume
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, template, resumeData, settings, isDraft } = req.body;

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    if (name) resume.name = name;
    if (template) resume.template = template;
    if (resumeData) resume.resumeData = resumeData;
    if (settings) resume.settings = { ...resume.settings, ...settings };
    if (typeof isDraft !== 'undefined') resume.isDraft = isDraft;
    
    resume.version += 1;

    await resume.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      'stats.lastResumeUpdate': new Date(),
    });

    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: { resume },
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume',
      error: error.message,
    });
  }
});

// Delete resume
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error.message,
    });
  }
});

// Get public resume (no auth required)
router.get('/public/:publicUrl', optionalAuth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ publicUrl: req.params.publicUrl });

    if (!resume || !resume.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or not public',
      });
    }

    // Track view
    resume.analytics.views += 1;
    if (req.user && resume.analytics.uniqueViews) {
      // Simple unique view tracking (can be improved)
      resume.analytics.lastViewed = new Date();
    }
    await resume.save();

    res.json({
      success: true,
      data: { resume },
    });
  } catch (error) {
    console.error('Get public resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error.message,
    });
  }
});

// Duplicate resume
router.post('/:id/duplicate', authenticate, async (req, res) => {
  try {
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const duplicatedResume = new Resume({
      userId: req.user._id,
      name: `${originalResume.name} (Copy)`,
      template: originalResume.template,
      resumeData: originalResume.resumeData,
      settings: originalResume.settings,
      isDraft: true,
    });

    await duplicatedResume.save();

    res.status(201).json({
      success: true,
      message: 'Resume duplicated successfully',
      data: { resume: duplicatedResume },
    });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate resume',
      error: error.message,
    });
  }
});

export default router;

