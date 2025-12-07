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

// Login attempts routes
router.get('/login-attempts', adminController.getLoginAttempts);
router.delete('/login-attempts/:id', adminController.deleteLoginAttempt);
router.delete('/login-attempts', adminController.bulkDeleteLoginAttempts);

// Security logging routes
router.get('/security-logs', adminController.getSecurityLogs);
router.delete('/security-logs/:id', adminController.deleteSecurityLog);
router.delete('/security-logs', adminController.bulkDeleteSecurityLogs);
router.get('/audit-logs', adminController.getAuditLogs);
router.delete('/audit-logs/:id', adminController.deleteAuditLog);
router.delete('/audit-logs', adminController.bulkDeleteAuditLogs);
router.get('/client-logs', adminController.getClientLogs);
router.delete('/client-logs/:id', adminController.deleteClientLog);
router.delete('/client-logs', adminController.bulkDeleteClientLogs);

// User management routes
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/ban', adminController.toggleUserBan);

// Platform statistics route
router.get('/platform-stats', adminController.getPlatformStats);

// Log management routes
router.get('/logs/statistics', adminController.getLogStatistics);
router.post('/logs/cleanup/soft-deleted', adminController.cleanupSoftDeletedLogs);
router.post('/logs/cleanup/old-active', adminController.cleanupOldActiveLogs);

export default router;

