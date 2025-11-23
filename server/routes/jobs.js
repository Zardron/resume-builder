import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { ensureOrganizationAccess, requirePermission } from '../middleware/rbac.js';
import * as jobController from '../controllers/jobController.js';

const router = express.Router();

// Job routes
router.get('/', authenticate, jobController.getJobs);
router.get('/:id', authenticate, jobController.getJob);
router.post('/', authenticate, requirePermission('canPostJobs'), jobController.createJob);
router.put('/:id', authenticate, requirePermission('canPostJobs'), jobController.updateJob);
router.delete('/:id', authenticate, requirePermission('canPostJobs'), jobController.deleteJob);
router.post('/:id/duplicate', authenticate, requirePermission('canPostJobs'), jobController.duplicateJob);
router.get('/:id/analytics', authenticate, ensureOrganizationAccess, jobController.getJobAnalytics);
router.post('/:id/publish', authenticate, requirePermission('canPostJobs'), jobController.publishJob);
router.post('/:id/pause', authenticate, requirePermission('canPostJobs'), jobController.pauseJob);

export default router;
