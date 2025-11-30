import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // Action type
  action: {
    type: String,
    required: true,
    enum: [
      'create',
      'read',
      'update',
      'delete',
      'export',
      'import',
      'login',
      'logout',
      'password_change',
      'role_change',
      'permission_change',
      'account_ban',
      'account_unban',
      'subscription_change',
      'credit_transaction',
      'payment',
      'data_export',
      'bulk_operation',
      'admin_action',
      'other'
    ],
    index: true,
  },
  
  // Resource information
  resourceType: {
    type: String,
    required: true,
    index: true, // e.g., 'User', 'Resume', 'JobPosting', 'Payment', etc.
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    default: null,
  },
  
  // User who performed the action
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  userRole: {
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
  
  // Change details
  changes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}, // Stores before/after values for updates
  },
  previousValues: {
    type: mongoose.Schema.Types.Mixed,
    default: null, // Snapshot of data before change
  },
  newValues: {
    type: mongoose.Schema.Types.Mixed,
    default: null, // Snapshot of data after change
  },
  
  // Additional context
  description: {
    type: String,
    default: null,
  },
  requestId: {
    type: String,
    index: true,
    default: null,
  },
  path: {
    type: String,
    index: true,
    default: null,
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    default: null,
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Indexes for common queries
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 }); // For time-based queries

// Auto-delete records older than 365 days (1 year for compliance)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;

