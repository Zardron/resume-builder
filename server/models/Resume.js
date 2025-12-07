import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Resume name is required'],
    trim: true,
  },
  template: {
    type: String,
    required: true,
    enum: [
      'modern', 'minimal', 'classic', 'spotlight', 'business', 'corporate',
      'creative', 'elegant', 'executive', 'formal', 'professional', 'technical',
      'academic', 'startup', 'dynamic', 'minimal-image'
    ],
    default: 'modern',
  },
  resumeData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  },
  settings: {
    accentColor: { type: String, default: '#2563eb' },
    font: { type: String, default: 'Inter' },
    paperSize: { type: String, default: 'A4' },
    margin: { type: String, default: '0.75"' },
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  publicUrl: {
    type: String,
    unique: true,
    sparse: true,
  },
  shareableLink: String,
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    lastViewed: Date,
  },
  collaborators: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['viewer', 'editor'], default: 'viewer' },
    addedAt: { type: Date, default: Date.now },
  }],
  version: {
    type: Number,
    default: 1,
  },
  isDraft: {
    type: Boolean,
    default: true,
  },
  isApplicationResume: {
    type: Boolean,
    default: false,
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  }],
  aiParsedData: {
    skills: [String],
    experience: Number,
    education: [{
      degree: String,
      field: String,
      institution: String,
      year: Number,
    }],
    certifications: [String],
  },
}, {
  timestamps: true,
});

// Index for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 });
// Note: publicUrl already has unique: true which creates an index automatically

// Method to generate public URL
resumeSchema.methods.generatePublicUrl = function() {
  const randomString = Math.random().toString(36).substring(2, 15);
  this.publicUrl = `${this.userId.toString().slice(-6)}-${randomString}`;
  return this.publicUrl;
};

export default mongoose.model('Resume', resumeSchema);

