import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema({
  // Event classification
  eventType: {
    type: String,
    required: true,
    enum: [
      'authentication',
      'authorization',
      'rate_limit',
      'suspicious_activity',
      'data_access',
      'data_modification',
      'system_error',
      'security_violation',
      'token_operation',
      'password_change',
      'email_verification',
      'account_lockout',
      'geo_mismatch',
      'device_mismatch',
      'brute_force_attempt',
      'sql_injection_attempt',
      'xss_attempt',
      'csrf_violation',
      'unauthorized_access',
      'privilege_escalation',
      'api_abuse',
      'bot_detection',
      'other'
    ],
    index: true,
  },
  
  // Severity level
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true,
  },
  
  // User information (if available)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null,
  },
  userEmail: {
    type: String,
    index: true,
    default: null,
  },
  
  // Request metadata
  ipAddress: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: {
    type: String,
    default: null,
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'bot', 'unknown'],
    default: 'unknown',
  },
  browser: {
    type: String,
    default: null,
  },
  os: {
    type: String,
    default: null,
  },
  
  // Geographic information (optional, can be populated by middleware)
  country: {
    type: String,
    default: null,
    index: true,
  },
  city: {
    type: String,
    default: null,
  },
  
  // Request details
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    default: null,
  },
  path: {
    type: String,
    index: true,
    default: null,
  },
  statusCode: {
    type: Number,
    index: true,
    default: null,
  },
  
  // Event details
  message: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  // Additional context
  requestId: {
    type: String,
    index: true,
    default: null,
  },
  sessionId: {
    type: String,
    index: true,
    default: null,
  },
  
  // Response time (for performance monitoring)
  responseTime: {
    type: Number,
    default: null, // in milliseconds
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for common queries
securityLogSchema.index({ eventType: 1, timestamp: -1 });
securityLogSchema.index({ userId: 1, timestamp: -1 });
securityLogSchema.index({ ipAddress: 1, timestamp: -1 });
securityLogSchema.index({ severity: 1, timestamp: -1 });
securityLogSchema.index({ eventType: 1, severity: 1, timestamp: -1 }); // Composite for filtering

// Auto-delete records older than 90 days (adjust based on compliance requirements)
// TTL index on timestamp (this also serves as the single-field index for time-based queries)
securityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);

export default SecurityLog;

