import { Link } from "react-router-dom";

const CreditsIndicator = ({ availableCredits = 0 }) => {
  const hasCredits = availableCredits > 0;
  const creditsLabel = `${availableCredits} credit${availableCredits === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col items-start gap-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 px-4 py-3 text-gray-900 dark:border-gray-700 dark:text-gray-100 md:items-end">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Credits
      </span>
      <span className="text-lg font-semibold">
        {hasCredits ? creditsLabel : "0 credits"}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {hasCredits
          ? "Free credits remaining"
          : "No free credits left — downloads will include a watermark until you buy more credits"}
      </span>
      <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
        When you run out of credits, downloads will include a watermark or credits footer unless you{" "}
        <Link
          to="/dashboard/purchase"
          className="underline underline-offset-2 cursor-pointer"
        >
          buy more credits
        </Link>
        .
      </span>
    </div>
  );
};

export default CreditsIndicator;


