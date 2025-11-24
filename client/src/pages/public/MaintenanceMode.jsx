import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { authAPI } from '../../services/api';

const MaintenanceMode = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(true);

  // Periodically check if maintenance mode is still enabled
  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const response = await authAPI.getPublicConfig();
        if (response && response.data) {
          setMaintenanceMode(response.data.maintenanceMode);
        }
      } catch (error) {
        console.error('Error checking maintenance status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkMaintenanceStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkMaintenanceStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // If maintenance mode is disabled, reload the page
  useEffect(() => {
    if (!isChecking && !maintenanceMode) {
      window.location.reload();
    }
  }, [maintenanceMode, isChecking]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-10 h-10 text-yellow-600 dark:text-yellow-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Under Maintenance
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We're currently performing scheduled maintenance to improve your experience.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>What's happening?</strong>
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                We're updating our systems to bring you new features and improvements. 
                This should only take a few minutes.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              <span>Checking status...</span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              We'll automatically redirect you when maintenance is complete.
            </p>

            {/* Admin Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Administrator?
              </p>
              <Link
                to="/admin-login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;

