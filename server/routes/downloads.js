import express from 'express';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { useCredits } from './credits.js';

const router = express.Router();

// Download resume (uses credits)
router.post('/:id', authenticate, async (req, res) => {
  try {
    const { format = 'pdf' } = req.body;
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

    const user = await User.findById(req.user._id);

    // Check if user has credits or is subscribed
    const hasCredits = user.credits > 0;
    const isSubscribed = user.subscription.status === 'active';

    if (!hasCredits && !isSubscribed) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient credits. Please purchase credits or subscribe to Premium.',
      });
    }

    // Use credit if not subscribed
    if (!isSubscribed) {
      try {
        await useCredits(
          req.user._id,
          1,
          `Downloaded resume: ${resume.name}`,
          resume._id
        );
      } catch (error) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient credits',
        });
      }
    }

    // Update resume analytics
    resume.analytics.downloads += 1;
    await resume.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.downloadsThisMonth': 1 },
    });

    // In production, generate actual PDF/DOCX file
    // For now, return success with resume data
    res.json({
      success: true,
      message: 'Resume download initiated',
      data: {
        resume: {
          id: resume._id,
          name: resume.name,
          format,
          downloadUrl: `/api/resumes/${resume._id}/file?format=${format}`, // Placeholder
        },
        creditsRemaining: isSubscribed ? user.credits : user.credits - 1,
      },
    });
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process download',
      error: error.message,
    });
  }
});

export default router;

