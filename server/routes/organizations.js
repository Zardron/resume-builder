import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, ensureOrganizationAccess } from '../middleware/rbac.js';
import * as organizationController from '../controllers/organizationController.js';

const router = express.Router();

// Organization routes
router.post('/', authenticate, organizationController.createOrganization);
router.get('/:orgId', authenticate, ensureOrganizationAccess, organizationController.getOrganization);
router.put('/:orgId', authenticate, requireRole('admin'), organizationController.updateOrganization);

// Team management routes
router.get('/:orgId/team', authenticate, ensureOrganizationAccess, organizationController.getTeamMembers);
router.post('/:orgId/team/invite', authenticate, requireRole('admin', 'manager'), organizationController.inviteTeamMember);
router.put('/:orgId/team/:memberId/role', authenticate, requireRole('admin', 'manager'), organizationController.updateTeamMemberRole);
router.delete('/:orgId/team/:memberId', authenticate, requireRole('admin'), organizationController.removeTeamMember);
router.get('/:orgId/team/activity', authenticate, ensureOrganizationAccess, organizationController.getTeamActivity);

export default router;
