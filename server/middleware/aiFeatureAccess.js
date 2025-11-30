// Middleware to check AI feature access based on subscription tier

// Feature to tier mapping based on AI_FEATURES_DOCUMENTATION.md
const FEATURE_TIERS = {
  // Basic Tier Features
  'enhance-summary': 'basic',
  'enhance-job-description': 'basic',
  'enhance-project-description': 'basic',
  'enhance-content': 'basic',
  'grammar-check': 'basic',
  'action-verbs': 'basic',
  
  // Pro Tier Features
  'parse-resume': 'pro',
  'remove-background': 'pro',
  'ats-optimization': 'pro',
  'keyword-suggestions': 'pro',
  'rewrite-bullets': 'pro',
  'readability-score': 'pro',
  
  // Enterprise Tier Features
  'resume-score': 'enterprise',
  'industry-suggestions': 'enterprise',
  'job-matching': 'enterprise',
  'skill-gap-analysis': 'enterprise',
  'career-path': 'enterprise',
  'cover-letter': 'enterprise',
  'interview-prep': 'enterprise',
  'salary-estimation': 'enterprise',
};

// Tier hierarchy (higher number = more features)
const TIER_LEVELS = {
  'free': 0,
  'basic': 1,
  'pro': 2,
  'enterprise': 3,
};

/**
 * Check if user's subscription tier has access to a feature
 */
const hasFeatureAccess = (userTier, requiredTier) => {
  const userLevel = TIER_LEVELS[userTier] || 0;
  const requiredLevel = TIER_LEVELS[requiredTier] || 999;
  return userLevel >= requiredLevel;
};

/**
 * Middleware factory to check AI feature access
 * @param {string} featureId - The feature identifier (e.g., 'enhance-summary')
 */
export const requireAIFeature = (featureId) => {
  return (req, res, next) => {
    // Must be authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check subscription status
    if (req.user.subscription.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Active AI subscription required to access this feature',
        requiredTier: FEATURE_TIERS[featureId] || 'unknown',
      });
    }

    // Get required tier for this feature
    const requiredTier = FEATURE_TIERS[featureId];
    if (!requiredTier) {
      // Unknown feature, allow access (for backward compatibility)
      return next();
    }

    // Get user's current tier
    const userTier = req.user.subscription.plan || 'free';

    // Check if user has access
    if (!hasFeatureAccess(userTier, requiredTier)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${requiredTier} tier subscription. Your current plan: ${userTier}`,
        requiredTier,
        currentTier: userTier,
        feature: featureId,
      });
    }

    next();
  };
};

/**
 * Get feature access info for a user
 */
export const getFeatureAccess = (user) => {
  if (!user || user.subscription.status !== 'active') {
    return {
      hasAccess: false,
      tier: 'free',
      features: [],
    };
  }

  const userTier = user.subscription.plan || 'free';
  const userLevel = TIER_LEVELS[userTier] || 0;

  // Get all features user has access to
  const accessibleFeatures = Object.entries(FEATURE_TIERS)
    .filter(([_, requiredTier]) => hasFeatureAccess(userTier, requiredTier))
    .map(([featureId]) => featureId);

  return {
    hasAccess: true,
    tier: userTier,
    level: userLevel,
    features: accessibleFeatures,
  };
};

