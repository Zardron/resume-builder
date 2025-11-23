import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    default: 'small',
  },
  website: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
  },
  subscription: {
    plan: {
      type: String,
      enum: ['starter', 'professional', 'enterprise'],
      default: 'starter',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trial'],
      default: 'trial',
    },
    seats: {
      type: Number,
      default: 1,
      min: 1,
    },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
  },
  settings: {
    branding: {
      primaryColor: {
        type: String,
        default: '#2563eb',
      },
      logo: String,
      customDomain: String,
    },
    features: {
      aiScreening: {
        type: Boolean,
        default: false,
      },
      advancedAnalytics: {
        type: Boolean,
        default: false,
      },
      apiAccess: {
        type: Boolean,
        default: false,
      },
      customWorkflows: {
        type: Boolean,
        default: false,
      },
    },
  },
  billing: {
    stripeCustomerId: String,
    billingEmail: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
}, {
  timestamps: true,
});

// Generate slug before saving
organizationSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for faster queries
organizationSchema.index({ slug: 1 });

export default mongoose.model('Organization', organizationSchema);

