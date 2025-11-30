import mongoose from 'mongoose';

const loginAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null,
  },
  ipAddress: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: {
    type: String,
    default: null,
  },
  success: {
    type: Boolean,
    required: true,
    index: true,
  },
  failureReason: {
    type: String,
    enum: [
      'invalid_email_format',
      'user_not_found',
      'invalid_password',
      'email_not_verified',
      'maintenance_mode',
      'login_disabled',
      'unknown'
    ],
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Index for common queries
loginAttemptSchema.index({ email: 1, timestamp: -1 });
loginAttemptSchema.index({ ipAddress: 1, timestamp: -1 });
loginAttemptSchema.index({ success: 1, timestamp: -1 });
loginAttemptSchema.index({ timestamp: -1 }); // For time-based queries

// Auto-delete records older than 90 days
loginAttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);

export default LoginAttempt;

