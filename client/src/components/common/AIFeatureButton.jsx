import { Link } from 'react-router-dom';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { hasFeatureAccess, getTierForFeature } from '../../utils/aiFeatures';

const AIFeatureButton = ({ 
  label = "AI Enhance", 
  description = "Unlock AI-powered enhancements",
  featureId, // Feature ID to check access (e.g., 'summary-enhancement', 'resume-scoring')
  onClick,
  disabled = false,
  className = ""
}) => {
  const { isSubscribed, subscriptionTier } = useApp();
  
  // Check if user has access to this specific feature
  const hasAccess = featureId 
    ? (isSubscribed && hasFeatureAccess(subscriptionTier, featureId))
    : isSubscribed; // Fallback: if no featureId provided, just check subscription
  
  // Get required tier for upgrade message
  const requiredTier = featureId ? getTierForFeature(featureId) : null;
  const tierNames = {
    'basic': 'Basic',
    'pro': 'Pro',
    'enterprise': 'Enterprise',
  };
  
  if (hasAccess) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <Sparkles className="h-4 w-4" />
        {label}
      </button>
    );
  }

  const upgradeMessage = requiredTier && subscriptionTier !== requiredTier
    ? `Upgrade to ${tierNames[requiredTier] || requiredTier} tier to unlock this feature`
    : 'Subscribe to unlock AI-powered enhancements';

  const tierColors = {
    'basic': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'pro': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'enterprise': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="flex items-start gap-3 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800/50">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 flex-shrink-0 mt-0.5">
        <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {label}
          </span>
          {requiredTier && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tierColors[requiredTier] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}>
              {tierNames[requiredTier] || requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {description || upgradeMessage}
        </p>
      </div>
      <Link
        to="/dashboard/subscription"
        className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md flex-shrink-0 whitespace-nowrap"
      >
        <span>
          {(() => {
            // Free account → Subscribe for Pro and Enterprise
            if (!isSubscribed || !subscriptionTier || subscriptionTier === 'free') {
              return 'Subscribe';
            }
            // Basic tier → Upgrade for Pro features
            if (subscriptionTier === 'basic' && requiredTier === 'pro') {
              return 'Upgrade';
            }
            // Pro tier → Upgrade for Enterprise features
            if (subscriptionTier === 'pro' && requiredTier === 'enterprise') {
              return 'Upgrade';
            }
            // All other cases → Subscribe
            return 'Subscribe';
          })()}
        </span>
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
};

export default AIFeatureButton;

