import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as recruiterApplicationController from '../controllers/recruiterApplicationController.js';

const router = express.Router();

// Middleware to check if user is super admin (for admin routes)
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Super admin access required',
    });
  }
  next();
};

// Public route - anyone can submit a recruiter application
router.post('/', recruiterApplicationController.createRecruiterApplication);

// Admin routes - require authentication and super admin role
router.get('/', authenticate, requireSuperAdmin, recruiterApplicationController.getRecruiterApplications);
router.get('/:id', authenticate, requireSuperAdmin, recruiterApplicationController.getRecruiterApplication);
router.put('/:id/status', authenticate, requireSuperAdmin, recruiterApplicationController.updateRecruiterApplicationStatus);
router.delete('/:id', authenticate, requireSuperAdmin, recruiterApplicationController.deleteRecruiterApplication);

export default router;

