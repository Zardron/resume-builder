import { Link } from 'react-router-dom';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const AIFeatureButton = ({ 
  label = "AI Enhance", 
  description = "Unlock AI-powered enhancements",
  onClick,
  disabled = false,
  className = ""
}) => {
  const { isSubscribed } = useApp();
  
  // Single subscription unlocks all AI features
  const hasAccess = isSubscribed;
  
  if (hasAccess) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <Sparkles className="h-4 w-4" />
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800/50">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 flex-shrink-0 mt-0.5">
        <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {label}
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
      <Link
        to="/dashboard/subscription"
        className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md flex-shrink-0 whitespace-nowrap"
      >
        <span>Subscribe</span>
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
};

export default AIFeatureButton;

