import mongoose from 'mongoose';

const clientLogSchema = new mongoose.Schema({
  // User information (if authenticated)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null,
  },
  sessionId: {
    type: String,
    index: true,
    default: null,
  },
  
  // Event type
  eventType: {
    type: String,
    required: true,
    enum: [
      'page_view',
      'route_change',
      'click',
      'form_submit',
      'api_request',
      'api_error',
      'error',
      'performance',
      'suspicious_activity',
      'rate_limit',
      'bot_behavior',
      'devtools_detection',
      'form_tampering',
      'button_bypass',
      'other'
    ],
    index: true,
  },
  
  // Severity
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info',
    index: true,
  },
  
  // Client information
  userAgent: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    default: null,
  },
  os: {
    type: String,
    default: null,
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'bot', 'unknown'],
    default: 'unknown',
  },
  screenResolution: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: null,
  },
  
  // Request metadata
  ipAddress: {
    type: String,
    index: true,
    default: null,
  },
  referrer: {
    type: String,
    default: null,
  },
  url: {
    type: String,
    required: true,
    index: true,
  },
  route: {
    type: String,
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
  
  // Error information (if applicable)
  error: {
    type: {
      name: String,
      message: String,
      stack: String,
      code: String,
    },
    default: null,
  },
  
  // API request details (if applicable)
  apiEndpoint: {
    type: String,
    default: null,
  },
  apiMethod: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    default: null,
  },
  apiStatusCode: {
    type: Number,
    default: null,
  },
  
  // Performance metrics (if applicable)
  loadTime: {
    type: Number,
    default: null, // in milliseconds
  },
  renderTime: {
    type: Number,
    default: null, // in milliseconds
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
  },
  
  // Status (for soft delete)
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active',
    index: true,
  },
}, {
  timestamps: true,
});

// Indexes for common queries
clientLogSchema.index({ eventType: 1, timestamp: -1 });
clientLogSchema.index({ userId: 1, timestamp: -1 });
clientLogSchema.index({ severity: 1, timestamp: -1 });
clientLogSchema.index({ route: 1, timestamp: -1 });

// Auto-delete records older than 30 days (client logs are more voluminous)
// TTL index on timestamp (this also serves as the single-field index for time-based queries)
clientLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const ClientLog = mongoose.model('ClientLog', clientLogSchema);

export default ClientLog;

