import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { checkMaintenanceMode } from './middleware/maintenance.js';
import { loadAndValidateEnv } from './config/envValidator.js';
import { logInfo, logError } from './utils/logger.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { securityHeaders, requestId } from './middleware/security.js';
import { initializeSocket } from './services/socketService.js';

// Import routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import creditRoutes from './routes/credits.js';
import subscriptionRoutes from './routes/subscriptions.js';
import paymentRoutes from './routes/payments.js';
import downloadRoutes from './routes/downloads.js';
import organizationRoutes from './routes/organizations.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import interviewRoutes from './routes/interviews.js';
import messageRoutes from './routes/messages.js';
import analyticsRoutes from './routes/analytics.js';
import dashboardRoutes from './routes/dashboards.js';
import billingRoutes from './routes/billing.js';
import adminRoutes from './routes/admin.js';
import recruiterApplicationRoutes from './routes/recruiterApplications.js';
import logsRoutes from './routes/logs.js';
import aiRoutes from './routes/ai.js';
import supportRoutes from './routes/support.js';
import { requestLogger, suspiciousActivityDetector } from './middleware/requestLogger.js';
import { initializeScheduledTasks } from './utils/scheduledTasks.js';

// Validate environment variables before starting
loadAndValidateEnv();

const app = express();
const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid AirPlay conflict

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://localhost:5000', // Allow localhost:5000 for development
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
};

// Security middleware (apply early)
app.use(requestId);
app.use(securityHeaders);

app.use(cors(corsOptions));
// Limit request body size to prevent DoS attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply rate limiting to all API routes
app.use('/api', apiRateLimiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeiqhub')
.then(async () => {
  logInfo('Connected to MongoDB');
  logInfo(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize scheduled tasks after database connection
  initializeScheduledTasks();
})
.catch((error) => {
  logError('MongoDB connection error', error);
  process.exit(1);
});

// Health check (bypass maintenance mode)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ResumeIQHub API Server is running',
    version: '1.0.0',
  });
});

// Maintenance mode check middleware (applied to all API routes)
// Runs before authentication, so super admin check is handled in routes
app.use('/api', checkMaintenanceMode);

// Security logging middleware (apply to all API routes)
app.use('/api', suspiciousActivityDetector);
app.use('/api', requestLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/organizations', billingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recruiter-applications', recruiterApplicationRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/support', supportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  logError('Unhandled error', err, {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;
