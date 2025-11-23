import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobPostingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
    index: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'],
    default: 'applied',
  },
  stage: {
    type: String,
    trim: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  screeningScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  recruiterNotes: [{
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    note: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  interviewSchedule: [{
    type: {
      type: String,
      enum: ['phone', 'video', 'onsite'],
    },
    scheduledAt: Date,
    duration: Number, // minutes
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    meetingLink: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  }],
  offer: {
    amount: Number,
    currency: String,
    startDate: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
    },
  },
  source: {
    type: String,
    enum: ['platform', 'referral', 'external'],
    default: 'platform',
  },
  coverLetter: String,
  answers: [{
    question: String,
    answer: String,
  }],
}, {
  timestamps: true,
});

// Indexes for faster queries
applicationSchema.index({ organizationId: 1, status: 1 });
applicationSchema.index({ applicantId: 1, status: 1 });
applicationSchema.index({ jobPostingId: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

export default mongoose.model('Application', applicationSchema);

