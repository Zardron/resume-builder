import { Link } from "react-router-dom";
import { Coins, AlertCircle } from "lucide-react";

const CreditsIndicator = ({ availableCredits = 0 }) => {
  const hasCredits = availableCredits > 0;
  const creditsLabel = `${availableCredits} credit${availableCredits === 1 ? "" : "s"}`;
  const isLow = availableCredits <= 5 && availableCredits > 0;

  return (
    <div 
      className="relative overflow-hidden rounded-md border border-white/30 bg-white/15 backdrop-blur-md px-6 py-5 shadow-xl"
      role="region"
      aria-label="Credits balance"
    >
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/25 backdrop-blur-sm" aria-hidden="true">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-white">
            Credits Balance
          </span>
        </div>
        <div className="mb-2">
          <span 
            className={`text-4xl font-bold ${hasCredits ? "text-white" : "text-white/70"}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {hasCredits ? availableCredits : "0"}
          </span>
        </div>
        <p className="mb-4 text-xs text-white/90" role="status">
          {hasCredits
            ? isLow
              ? "Running low — consider purchasing more"
              : `${creditsLabel} available`
            : "No credits remaining"}
        </p>
        {!hasCredits && (
          <Link
            to="/dashboard/purchase"
            className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:border-white/60"
            aria-label="Purchase credits"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30" aria-hidden="true">
              <AlertCircle className="h-2.5 w-2.5 text-white" />
            </div>
            Buy Credits
          </Link>
        )}
      </div>
    </div>
  );
};

export default CreditsIndicator;


