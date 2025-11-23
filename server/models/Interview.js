import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true,
  },
  jobPostingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  interviewers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['primary', 'secondary'],
      default: 'primary',
    },
  }],
  type: {
    type: String,
    enum: ['phone', 'video', 'onsite', 'panel'],
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    default: 60, // minutes
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  location: String, // physical location or video link
  meetingLink: String,
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  feedback: [{
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: String,
    recommendation: {
      type: String,
      enum: ['hire', 'maybe', 'no-hire'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  reminders: [{
    sentAt: Date,
    type: {
      type: String,
      enum: ['email', 'sms'],
    },
  }],
  notes: String,
  cancelledReason: String,
  rescheduledFrom: Date,
}, {
  timestamps: true,
});

// Indexes
interviewSchema.index({ organizationId: 1, scheduledAt: 1 });
interviewSchema.index({ applicantId: 1, scheduledAt: 1 });
interviewSchema.index({ status: 1, scheduledAt: 1 });

export default mongoose.model('Interview', interviewSchema);

