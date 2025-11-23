import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { ensureOrganizationAccess } from '../middleware/rbac.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

// Message routes
router.get('/conversations', authenticate, messageController.getConversations);
router.get('/conversations/:id', authenticate, messageController.getConversationById);
router.get('/conversations/:applicationId', authenticate, messageController.getOrCreateConversation);
router.get('/conversations/:conversationId/messages', authenticate, messageController.getMessages);
router.post('/conversations/:conversationId/messages', authenticate, messageController.sendMessage);
router.put('/messages/:messageId/read', authenticate, messageController.markMessageAsRead);
router.get('/templates', authenticate, ensureOrganizationAccess, messageController.getMessageTemplates);
router.post('/send-template', authenticate, ensureOrganizationAccess, messageController.sendTemplateMessage);

export default router;
