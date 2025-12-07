import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { ensureOrganizationAccess } from '../middleware/rbac.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

// Message routes
router.get('/conversations', authenticate, messageController.getConversations);
router.post('/conversations', authenticate, messageController.createConversation);
// More specific routes must come before generic :id route
router.get('/conversations/application/:applicationId', authenticate, messageController.getOrCreateConversation);
router.get('/conversations/:conversationId/messages', authenticate, messageController.getMessages);
router.post('/conversations/:conversationId/messages', authenticate, messageController.sendMessage);
router.get('/conversations/:id', authenticate, messageController.getConversationById);
router.put('/messages/:messageId/read', authenticate, messageController.markMessageAsRead);
router.get('/templates', authenticate, ensureOrganizationAccess, messageController.getMessageTemplates);
router.post('/send-template', authenticate, ensureOrganizationAccess, messageController.sendTemplateMessage);

export default router;
