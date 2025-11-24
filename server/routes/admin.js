import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Middleware to check if user is super admin
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

// All routes require authentication and super admin role
router.use(authenticate);
router.use(requireSuperAdmin);

// Create organization with multiple team members
router.post('/organizations/create', adminController.createOrganizationWithMembers);

// Get all organizations
router.get('/organizations', adminController.getAllOrganizations);

// Get organization details with members
router.get('/organizations/:orgId', adminController.getOrganizationDetails);

// Get all recruiters
router.get('/recruiters', adminController.getAllRecruiters);

// System configuration routes
router.get('/system-config', adminController.getSystemConfig);
router.put('/system-config', adminController.updateSystemConfig);

export default router;

