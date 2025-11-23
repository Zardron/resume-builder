import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { ensureOrganizationAccess, requirePermission } from '../middleware/rbac.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

// Analytics routes
router.get('/overview', authenticate, ensureOrganizationAccess, analyticsController.getOverview);
router.get('/hiring-funnel', authenticate, ensureOrganizationAccess, analyticsController.getHiringFunnel);
router.get('/time-to-hire', authenticate, ensureOrganizationAccess, analyticsController.getTimeToHire);
router.get('/source-analytics', authenticate, ensureOrganizationAccess, analyticsController.getSourceAnalytics);
router.get('/team-performance', authenticate, ensureOrganizationAccess, requirePermission('canViewAnalytics'), analyticsController.getTeamPerformance);
router.get('/job-performance', authenticate, ensureOrganizationAccess, analyticsController.getJobPerformance);

export default router;
