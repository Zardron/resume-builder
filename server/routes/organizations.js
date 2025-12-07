import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, ensureOrganizationAccess } from '../middleware/rbac.js';
import * as organizationController from '../controllers/organizationController.js';

const router = express.Router();

// Organization routes
router.post('/', authenticate, organizationController.createOrganization);
router.get('/:orgId', authenticate, ensureOrganizationAccess, organizationController.getOrganization);
router.put('/:orgId', authenticate, requireRole('admin'), organizationController.updateOrganization);

export default router;
