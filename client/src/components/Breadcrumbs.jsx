import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path) => {
    const names = {
      dashboard: 'Dashboard',
      builder: 'Resume Builder',
      purchase: 'Purchase Credits',
      subscription: 'Subscription',
      profile: 'Profile',
      settings: 'Settings',
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (pathnames.length === 0) return null;

  return (
    <div className="w-full mt-4 border-b border-gray-200 dark:border-gray-700">
      <nav
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 py-3 px-4 md:px-8 max-w-7xl mx-auto"
        aria-label="Breadcrumb"
      >
        <Link
          to="/"
          className="flex items-center hover:text-[var(--primary-color)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 rounded"
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
        </Link>
        {pathnames.map((path, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = getBreadcrumbName(path);

          return (
            <div key={routeTo} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
              {isLast ? (
                <span 
                  className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-none" 
                  aria-current="page"
                  title={name}
                >
                  {name}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-[var(--primary-color)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 rounded truncate max-w-[200px] md:max-w-none"
                  title={name}
                >
                  {name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;

