import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAIFeature } from '../middleware/aiFeatureAccess.js';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

// All AI routes require authentication
router.use(authenticate);

// Basic Tier Features
router.post('/enhance-summary', requireAIFeature('enhance-summary'), aiController.enhanceProfessionalSummary);
router.post('/enhance-job-description', requireAIFeature('enhance-job-description'), aiController.enhanceJobDescription);
router.post('/enhance-project-description', requireAIFeature('enhance-project-description'), aiController.enhanceProjectDescription);
router.post('/enhance-content', requireAIFeature('enhance-content'), aiController.enhanceContent);
router.post('/grammar-check', requireAIFeature('grammar-check'), aiController.checkGrammarAndSpelling);
router.post('/action-verbs', requireAIFeature('action-verbs'), aiController.getActionVerbSuggestions);

// Pro Tier Features
router.post('/parse-resume', requireAIFeature('parse-resume'), aiController.parseResume);
router.post('/remove-background', requireAIFeature('remove-background'), aiController.removeBackground);
router.post('/ats-optimization', requireAIFeature('ats-optimization'), aiController.getATSOptimization);
router.post('/keyword-suggestions', requireAIFeature('keyword-suggestions'), aiController.getKeywordSuggestions);
router.post('/rewrite-bullets', requireAIFeature('rewrite-bullets'), aiController.rewriteBulletPoints);
router.post('/readability-score', requireAIFeature('readability-score'), aiController.getReadabilityScore);

// Enterprise Tier Features
router.post('/resume-score', requireAIFeature('resume-score'), aiController.getResumeScore);
router.post('/industry-suggestions', requireAIFeature('industry-suggestions'), aiController.getIndustrySuggestions);
router.post('/job-matching', requireAIFeature('job-matching'), aiController.matchJobDescription);
router.post('/skill-gap-analysis', requireAIFeature('skill-gap-analysis'), aiController.analyzeSkillGaps);
router.post('/career-path', requireAIFeature('career-path'), aiController.getCareerPathSuggestions);
router.post('/cover-letter', requireAIFeature('cover-letter'), aiController.generateCoverLetter);
router.post('/interview-prep', requireAIFeature('interview-prep'), aiController.generateInterviewQuestions);
router.post('/salary-estimation', requireAIFeature('salary-estimation'), aiController.estimateSalaryRange);

export default router;

