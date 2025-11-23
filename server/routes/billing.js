import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, ensureOrganizationAccess } from '../middleware/rbac.js';
import * as billingController from '../controllers/billingController.js';

const router = express.Router();

// Billing routes
router.get('/:orgId/billing/subscription', authenticate, ensureOrganizationAccess, billingController.getSubscription);
router.get('/:orgId/billing/plans', authenticate, ensureOrganizationAccess, billingController.getPlans);
router.post('/:orgId/billing/subscribe', authenticate, requireRole('admin'), billingController.subscribe);
router.put('/:orgId/billing/update-plan', authenticate, requireRole('admin'), billingController.updatePlan);
router.get('/:orgId/billing/invoices', authenticate, ensureOrganizationAccess, billingController.getInvoices);
router.get('/:orgId/billing/payment-methods', authenticate, ensureOrganizationAccess, billingController.getPaymentMethods);
router.post('/:orgId/billing/payment-methods', authenticate, requireRole('admin'), billingController.addPaymentMethod);

export default router;
