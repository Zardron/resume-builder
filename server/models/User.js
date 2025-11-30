import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    maxlength: [128, 'Password must be less than 128 characters'],
    select: false, // Don't return password by default
    validate: {
      validator: function(v) {
        // Password must contain at least one uppercase, one lowercase, one number, and one special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
  },
  userType: {
    type: String,
    enum: ['applicant', 'recruiter', 'both'],
    default: 'applicant',
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true,
  },
  credits: {
    type: Number,
    default: 0,
    min: 0,
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'none'],
      default: 'none',
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentMethod: String,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationCode: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  lastActivity: Date, // Track last user activity for online/offline status
  profile: {
    title: String,
    company: String,
    bio: String,
    avatar: String,
    timezone: String,
  },
  preferences: {
    autosave: { type: Boolean, default: true },
    onboardingTips: { type: Boolean, default: false },
    fullscreenPreview: { type: Boolean, default: true },
    showGuidelines: { type: Boolean, default: true },
    notifications: {
      productUpdates: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      interviewReminders: { type: Boolean, default: false },
      creditsLow: { type: Boolean, default: true },
      browserPush: { type: Boolean, default: false },
    },
  },
  resumeDefaults: {
    accentColor: { type: String, default: '#2563eb' },
    font: { type: String, default: 'Inter' },
    paperSize: { type: String, default: 'A4' },
    margin: { type: String, default: '0.75"' },
    defaultTemplate: { type: String, default: 'modern' },
  },
  stats: {
    resumesCreated: { type: Number, default: 0 },
    downloadsThisMonth: { type: Number, default: 0 },
    lastResumeUpdate: Date,
  },
  applicantProfile: {
    skills: [String],
    experience: Number, // years
    education: [{
      degree: String,
      field: String,
      institution: String,
      year: Number,
    }],
    preferredLocations: [String],
    preferredJobTypes: [String],
    salaryExpectation: {
      min: Number,
      currency: String,
    },
    availability: {
      type: String,
      enum: ['immediate', '2-weeks', '1-month', 'flexible'],
    },
    linkedInUrl: String,
    portfolioUrl: String,
    githubUrl: String,
  },
  recruiterProfile: {
    department: String,
    specialization: [String],
    hiringGoals: Number, // positions to fill
    currentPipeline: Number,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add credits
userSchema.methods.addCredits = function(amount) {
  this.credits += amount;
  return this.save();
};

// Method to use credits
userSchema.methods.useCredits = function(amount) {
  if (this.credits < amount) {
    throw new Error('Insufficient credits');
  }
  this.credits -= amount;
  return this.save();
};

export default mongoose.model('User', userSchema);

