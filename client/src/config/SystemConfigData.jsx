// SystemConfigData - Centralized system configuration data
export const defaultConfig = {
  general: {
    siteName: 'ResumeIQHub',
    siteUrl: 'https://resumeiqhub.com',
    maintenanceMode: false,
    allowRegistrations: true,
    allowJobSeekerLoginSignup: true,
    allowTeamOrganizationLoginSignup: true,
    allowRecruiterLogin: true,
    enableAIFeatures: true,
    enableResumeBuilder: true,
    enableJobPostings: true,
    enableMessaging: true,
    enableInterviewScheduling: true,
    enableCreditSystem: true,
    enableSubscriptionSystem: true,
    enablePublicProfiles: true,
    enableSocialLogin: false,
    enablePasswordReset: true,
    enableAnalytics: true,
    enableAPIAccess: false,
    enableWebhooks: false,
    enableExportFeatures: true,
    enableImportFeatures: false,
    // Application & Candidate Management
    enableApplications: true,
    enableCandidateScreening: true,
    enableAIMatching: true,
    // Team & Organization
    enableTeamManagement: true,
    enableOrganizationManagement: true,
    // Billing
    enableBilling: true,
    // Recruiter Application
    enableRecruiterApplications: true,
    // Advanced Features
    enableCustomWorkflows: true,
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireEmailVerification: true,
    enable2FA: false,
    enableRateLimiting: true,
    enableIPWhitelisting: false,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    adminAlerts: true,
    smsNotifications: false,
    inAppNotifications: true,
  },
  integrations: {
    stripeEnabled: true,
    cloudinaryEnabled: true,
  },
};

// System Settings Configuration - organized by logical groups
export const systemSettingsConfig = {
  systemControl: [
    {
      key: 'maintenanceMode',
      label: 'Maintenance Mode',
      description: 'Temporarily disable public access',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'allowRegistrations',
      label: 'Allow Registrations',
      description: 'Enable new user registrations',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'allowJobSeekerLoginSignup',
      label: 'Allow Job Seeker Login',
      description: 'Enable job seeker login',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'allowTeamOrganizationLoginSignup',
      label: 'Allow Team / Organization Login',
      description: 'Enable team / organization login',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'allowRecruiterLogin',
      label: 'Allow Recruiter Login',
      description: 'Enable recruiter login',
      type: 'toggle',
      category: 'general',
    },
  ],
  coreFeatures: [
    {
      key: 'enableResumeBuilder',
      label: 'Resume Builder',
      description: 'Enable resume creation and editing',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableJobPostings',
      label: 'Job Postings',
      description: 'Enable job posting and browsing',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableAIFeatures',
      label: 'AI Features',
      description: 'Enable AI-powered resume enhancements',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableApplications',
      label: 'Job Applications',
      description: 'Enable job application submissions',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableCandidateScreening',
      label: 'Candidate Screening',
      description: 'Enable candidate evaluation and screening tools',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableAIMatching',
      label: 'AI Candidate Matching',
      description: 'Enable AI-powered candidate-job matching',
      type: 'toggle',
      category: 'general',
    },
  ],
  communication: [
    {
      key: 'enableMessaging',
      label: 'Messaging System',
      description: 'Enable user-to-user messaging',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableInterviewScheduling',
      label: 'Interview Scheduling',
      description: 'Enable interview scheduling features',
      type: 'toggle',
      category: 'general',
    },
  ],
  userManagement: [
    {
      key: 'enablePublicProfiles',
      label: 'Public Profiles',
      description: 'Enable public user profiles',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableSocialLogin',
      label: 'Social Login',
      description: 'Enable OAuth social authentication',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enablePasswordReset',
      label: 'Password Reset',
      description: 'Enable password reset functionality',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableTeamManagement',
      label: 'Team Management',
      description: 'Enable team member management features',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableOrganizationManagement',
      label: 'Organization Management',
      description: 'Enable organization settings and management',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableRecruiterApplications',
      label: 'Recruiter Applications',
      description: 'Allow recruiters to apply for accounts',
      type: 'toggle',
      category: 'general',
    },
  ],
  paymentMonetization: [
    {
      key: 'enableCreditSystem',
      label: 'Credit System',
      description: 'Enable credit-based purchases',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableSubscriptionSystem',
      label: 'Subscription System',
      description: 'Enable subscription plans',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableBilling',
      label: 'Billing System',
      description: 'Enable billing and payment processing',
      type: 'toggle',
      category: 'general',
    },
  ],
  integrationsAPI: [
    {
      key: 'enableAnalytics',
      label: 'Analytics',
      description: 'Enable analytics tracking',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableAPIAccess',
      label: 'API Access',
      description: 'Enable REST API endpoints',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableWebhooks',
      label: 'Webhooks',
      description: 'Enable webhook notifications',
      type: 'toggle',
      category: 'general',
    },
  ],
  dataManagement: [
    {
      key: 'enableExportFeatures',
      label: 'Export Features',
      description: 'Enable data export functionality',
      type: 'toggle',
      category: 'general',
    },
    {
      key: 'enableImportFeatures',
      label: 'Import Features',
      description: 'Enable data import functionality',
      type: 'toggle',
      category: 'general',
    },
  ],
  advancedFeatures: [
    {
      key: 'enableCustomWorkflows',
      label: 'Custom Workflows',
      description: 'Enable custom workflow configuration (Enterprise)',
      type: 'toggle',
      category: 'general',
    },
  ],
};

// Security Settings Configuration
export const securitySettingsConfig = [
  {
    key: 'sessionTimeout',
    label: 'Session Timeout (minutes)',
    description: '',
    type: 'number',
    category: 'security',
    min: 5,
    max: 1440,
  },
  {
    key: 'maxLoginAttempts',
    label: 'Max Login Attempts',
    description: '',
    type: 'number',
    category: 'security',
    min: 3,
    max: 10,
  },
  {
    key: 'requireEmailVerification',
    label: 'Require Email Verification',
    description: 'Users must verify email to access',
    type: 'toggle',
    category: 'security',
  },
  {
    key: 'enable2FA',
    label: 'Enable 2FA',
    description: 'Two-factor authentication',
    type: 'toggle',
    category: 'security',
  },
  {
    key: 'enableRateLimiting',
    label: 'Rate Limiting',
    description: 'Enable API rate limiting',
    type: 'toggle',
    category: 'security',
  },
  {
    key: 'enableIPWhitelisting',
    label: 'IP Whitelisting',
    description: 'Restrict access to whitelisted IPs',
    type: 'toggle',
    category: 'security',
  },
];

// Notification Settings Configuration
export const notificationSettingsConfig = [
  {
    key: 'emailNotifications',
    label: 'Email Notifications',
    description: 'Send email notifications',
    type: 'toggle',
    category: 'notifications',
  },
  {
    key: 'pushNotifications',
    label: 'Push Notifications',
    description: 'Browser push notifications',
    type: 'toggle',
    category: 'notifications',
  },
  {
    key: 'smsNotifications',
    label: 'SMS Notifications',
    description: 'Send SMS text notifications',
    type: 'toggle',
    category: 'notifications',
  },
  {
    key: 'inAppNotifications',
    label: 'In-App Notifications',
    description: 'Show in-app notification center',
    type: 'toggle',
    category: 'notifications',
  },
  {
    key: 'adminAlerts',
    label: 'Admin Alerts',
    description: 'Critical system alerts',
    type: 'toggle',
    category: 'notifications',
  },
];

// Integrations Settings Configuration
export const integrationsSettingsConfig = [
  {
    key: 'stripeEnabled',
    label: 'Stripe Payment',
    description: 'Enable Stripe payment processing',
    type: 'toggle',
    category: 'integrations',
  },
  {
    key: 'cloudinaryEnabled',
    label: 'Cloudinary Media',
    description: 'Enable Cloudinary image/media hosting',
    type: 'toggle',
    category: 'integrations',
  },
];

// General Text Input Settings Configuration
export const generalTextSettingsConfig = [
  {
    key: 'siteName',
    label: 'Site Name',
    description: 'The name of your platform',
    type: 'text',
    category: 'general',
  },
  {
    key: 'siteUrl',
    label: 'Site URL',
    description: 'The base URL of your platform',
    type: 'text',
    category: 'general',
  },
];

// Get all system settings configuration grouped by section
export const getSystemSettingsConfig = () => systemSettingsConfig;

// Get all security settings configuration
export const getSecuritySettingsConfig = () => securitySettingsConfig;

// Get all notification settings configuration
export const getNotificationSettingsConfig = () => notificationSettingsConfig;

// Get all integrations settings configuration
export const getIntegrationsSettingsConfig = () => integrationsSettingsConfig;

// Get all general text input settings configuration
export const getGeneralTextSettingsConfig = () => generalTextSettingsConfig;

// Get configuration item by key
export const getConfigItem = (key, category = 'general') => {
  // Search in system settings
  for (const group of Object.values(systemSettingsConfig)) {
    const item = group.find(i => i.key === key && i.category === category);
    if (item) return item;
  }
  
  // Search in security settings
  const securityItem = securitySettingsConfig.find(i => i.key === key && i.category === category);
  if (securityItem) return securityItem;
  
  // Search in notification settings
  const notificationItem = notificationSettingsConfig.find(i => i.key === key && i.category === category);
  if (notificationItem) return notificationItem;
  
  return null;
};

// Get all configuration items for a specific category
export const getConfigItemsByCategory = (category) => {
  const items = [];
  
  // Search in system settings
  for (const group of Object.values(systemSettingsConfig)) {
    items.push(...group.filter(i => i.category === category));
  }
  
  // Search in security settings
  items.push(...securitySettingsConfig.filter(i => i.category === category));
  
  // Search in notification settings
  items.push(...notificationSettingsConfig.filter(i => i.category === category));
  
  return items;
};

export default {
  defaultConfig,
  getSystemSettingsConfig,
  getSecuritySettingsConfig,
  getNotificationSettingsConfig,
  getIntegrationsSettingsConfig,
  getGeneralTextSettingsConfig,
  getConfigItem,
  getConfigItemsByCategory,
};

