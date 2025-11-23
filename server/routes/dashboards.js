import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { ensureOrganizationAccess } from '../middleware/rbac.js';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Recruiter dashboard routes
router.get('/recruiter/stats', authenticate, ensureOrganizationAccess, dashboardController.getRecruiterStats);
router.get('/recruiter/pipeline', authenticate, ensureOrganizationAccess, dashboardController.getRecruiterPipeline);
router.get('/recruiter/activity', authenticate, ensureOrganizationAccess, dashboardController.getRecruiterActivity);
router.get('/recruiter/upcoming-interviews', authenticate, ensureOrganizationAccess, dashboardController.getRecruiterUpcomingInterviews);

// Applicant dashboard routes
router.get('/applicant/overview', authenticate, dashboardController.getApplicantOverview);
router.get('/applicant/recommended-jobs', authenticate, dashboardController.getApplicantRecommendedJobs);
router.get('/applicant/applications', authenticate, dashboardController.getApplicantApplications);
router.get('/applicant/stats', authenticate, dashboardController.getApplicantStats);

export default router;
