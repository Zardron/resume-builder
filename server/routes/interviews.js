import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { ensureOrganizationAccess, requireApplicant } from '../middleware/rbac.js';
import * as interviewController from '../controllers/interviewController.js';

const router = express.Router();

// Interview routes
router.get('/', authenticate, interviewController.getInterviews);
router.get('/:id', authenticate, interviewController.getInterview);
router.post('/', authenticate, ensureOrganizationAccess, interviewController.createInterview);
router.put('/:id', authenticate, ensureOrganizationAccess, interviewController.updateInterview);
router.delete('/:id', authenticate, ensureOrganizationAccess, interviewController.deleteInterview);
router.post('/:id/confirm', authenticate, requireApplicant, interviewController.confirmInterview);
router.post('/:id/reschedule', authenticate, interviewController.rescheduleInterview);
router.post('/:id/cancel', authenticate, interviewController.cancelInterview);
router.post('/:id/feedback', authenticate, ensureOrganizationAccess, interviewController.submitFeedback);
router.get('/calendar/:userId', authenticate, interviewController.getCalendar);

export default router;
