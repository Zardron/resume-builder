import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  location: {
    type: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      default: 'onsite',
    },
    city: String,
    state: String,
    country: String,
    coordinates: [Number], // [longitude, latitude]
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
    default: 'full-time',
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
  },
  department: {
    type: String,
    trim: true,
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'mid',
  },
  skills: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'archived'],
    default: 'draft',
  },
  publishedAt: Date,
  expiresAt: Date,
  applicationCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  screeningCriteria: {
    minExperience: Number,
    requiredSkills: [String],
    educationLevel: String,
  },
  aiMatchingEnabled: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
jobPostingSchema.index({ organizationId: 1, status: 1 });
jobPostingSchema.index({ status: 1, publishedAt: -1 });
jobPostingSchema.index({ 'location.type': 1 });
jobPostingSchema.index({ skills: 1 });
jobPostingSchema.index({ experienceLevel: 1 });

export default mongoose.model('JobPosting', jobPostingSchema);

