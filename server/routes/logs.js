import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Client log endpoint - accepts logs from frontend (optional auth)
router.post('/client', optionalAuth, adminController.createClientLog);

export default router;

