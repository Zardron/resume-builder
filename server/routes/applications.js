import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { ensureOrganizationAccess, requireApplicant } from '../middleware/rbac.js';
import * as applicationController from '../controllers/applicationController.js';

const router = express.Router();

// Application routes
router.get('/', authenticate, applicationController.getApplications);
router.get('/:id', authenticate, applicationController.getApplication);
router.post('/', authenticate, requireApplicant, applicationController.createApplication);
router.put('/:id/status', authenticate, ensureOrganizationAccess, applicationController.updateApplicationStatus);
router.post('/:id/notes', authenticate, ensureOrganizationAccess, applicationController.addNote);
router.post('/:id/tags', authenticate, ensureOrganizationAccess, applicationController.addTags);
router.post('/:id/rating', authenticate, ensureOrganizationAccess, applicationController.rateApplication);
router.post('/:id/withdraw', authenticate, requireApplicant, applicationController.withdrawApplication);
router.get('/:id/ai-match', authenticate, ensureOrganizationAccess, applicationController.getAIMatch);
router.post('/bulk-action', authenticate, ensureOrganizationAccess, applicationController.bulkAction);

export default router;
