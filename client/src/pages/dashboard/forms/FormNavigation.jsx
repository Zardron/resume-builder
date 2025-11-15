import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const FormNavigation = ({
  onNext,
  onPrevious,
  showNext = true,
  showPrevious = true,
  nextLabel = "Next",
  previousLabel = "Previous",
  isNextDisabled = false,
  isPreviousDisabled = false,
}) => {
  if (!showNext && !showPrevious) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {showPrevious ? (
        <button
          type="button"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          {previousLabel}
        </button>
      ) : (
        <span className="hidden sm:block" />
      )}

      {showNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white text-sm font-semibold shadow-md hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {nextLabel}
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FormNavigation;

