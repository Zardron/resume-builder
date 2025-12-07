import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as supportController from '../controllers/supportController.js';

const router = express.Router();

// Public routes - no authentication required
router.post('/public/contact', supportController.createPublicContact);

// User routes - require authentication
router.post('/tickets', authenticate, supportController.createSupportTicket);
router.get('/tickets', authenticate, supportController.getUserTickets);
router.get('/tickets/:id', authenticate, supportController.getTicketById);
router.post('/tickets/:id/response', authenticate, supportController.addTicketResponse);

// Admin routes - require authentication and admin role
router.get('/admin/tickets', authenticate, supportController.getAllTickets);
router.put('/admin/tickets/:id/status', authenticate, supportController.updateTicketStatus);
router.post('/admin/tickets/:id/notes', authenticate, supportController.addInternalNote);
router.get('/admin/statistics', authenticate, supportController.getTicketStatistics);

export default router;
