const LoadingSkeleton = ({ type = 'default', className = '' }) => {
  const skeletons = {
    card: (
      <div className={`animate-pulse rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    ),
    text: (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    ),
    button: (
      <div className={`animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
    ),
    avatar: (
      <div className={`animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 ${className}`} />
    ),
    default: (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
    ),
  };

  return skeletons[type] || skeletons.default;
};

export default LoadingSkeleton;

