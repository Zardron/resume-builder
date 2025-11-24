import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  // General settings
  general: {
    siteName: {
      type: String,
      default: 'ResumeIQHub',
    },
    siteUrl: {
      type: String,
      default: 'https://resumeiqhub.com',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowRegistrations: {
      type: Boolean,
      default: true,
    },
    allowJobSeekerLoginSignup: {
      type: Boolean,
      default: true,
    },
    allowTeamOrganizationLoginSignup: {
      type: Boolean,
      default: true,
    },
    allowRecruiterLogin: {
      type: Boolean,
      default: true,
    },
    enableAIFeatures: {
      type: Boolean,
      default: true,
    },
    enableResumeBuilder: {
      type: Boolean,
      default: true,
    },
    enableJobPostings: {
      type: Boolean,
      default: true,
    },
    enableMessaging: {
      type: Boolean,
      default: true,
    },
    enableInterviewScheduling: {
      type: Boolean,
      default: true,
    },
    enableCreditSystem: {
      type: Boolean,
      default: true,
    },
    enableSubscriptionSystem: {
      type: Boolean,
      default: true,
    },
    enablePublicProfiles: {
      type: Boolean,
      default: true,
    },
    enableSocialLogin: {
      type: Boolean,
      default: false,
    },
    enablePasswordReset: {
      type: Boolean,
      default: true,
    },
    enableAnalytics: {
      type: Boolean,
      default: true,
    },
    enableAPIAccess: {
      type: Boolean,
      default: false,
    },
    enableWebhooks: {
      type: Boolean,
      default: false,
    },
    enableExportFeatures: {
      type: Boolean,
      default: true,
    },
    enableImportFeatures: {
      type: Boolean,
      default: false,
    },
    // Application & Candidate Management
    enableApplications: {
      type: Boolean,
      default: true,
    },
    enableCandidateScreening: {
      type: Boolean,
      default: true,
    },
    enableAIMatching: {
      type: Boolean,
      default: true,
    },
    // Team & Organization
    enableTeamManagement: {
      type: Boolean,
      default: true,
    },
    enableOrganizationManagement: {
      type: Boolean,
      default: true,
    },
    // Billing
    enableBilling: {
      type: Boolean,
      default: true,
    },
    // Recruiter Application
    enableRecruiterApplications: {
      type: Boolean,
      default: true,
    },
    // Advanced Features
    enableCustomWorkflows: {
      type: Boolean,
      default: true,
    },
  },
  // Security settings
  security: {
    sessionTimeout: {
      type: Number,
      default: 30,
      min: 5,
      max: 1440,
    },
    maxLoginAttempts: {
      type: Number,
      default: 5,
      min: 3,
      max: 10,
    },
    requireEmailVerification: {
      type: Boolean,
      default: true,
    },
    enable2FA: {
      type: Boolean,
      default: false,
    },
    enableRateLimiting: {
      type: Boolean,
      default: true,
    },
    enableIPWhitelisting: {
      type: Boolean,
      default: false,
    },
  },
  // Notification settings
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: false,
    },
    inAppNotifications: {
      type: Boolean,
      default: true,
    },
    adminAlerts: {
      type: Boolean,
      default: true,
    },
  },
  // Integration settings
  integrations: {
    stripeEnabled: {
      type: Boolean,
      default: true,
    },
    cloudinaryEnabled: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

// Ensure only one system config document exists
systemConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    // Create default config if none exists
    config = new this({});
    await config.save();
  }
  return config;
};

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

export default SystemConfig;

