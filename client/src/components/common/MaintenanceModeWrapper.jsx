import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { authAPI } from '../../services/api';
import MaintenanceMode from '../../pages/public/MaintenanceMode';
import LoadingSkeleton from '../ui/LoadingSkeleton';

// MaintenanceModeWrapper - checks maintenance mode, super admins can bypass
const MaintenanceModeWrapper = ({ children }) => {
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await authAPI.getPublicConfig();
        if (response && response.data) {
          setMaintenanceMode(response.data.maintenanceMode || false);
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
        // Default to no maintenance mode if check fails
        setMaintenanceMode(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkMaintenanceMode();
  }, []);

  // Show loading while checking
  if (isChecking || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton type="default" className="w-64" />
      </div>
    );
  }

  // Always allow access to admin login page (even during maintenance)
  if (location.pathname === '/admin-login') {
    return children;
  }

  // Check if user is super admin - they can bypass maintenance mode
  const isSuperAdmin = user?.role === 'super_admin';

  // If maintenance mode is enabled and user is not super admin, show maintenance page
  if (maintenanceMode && !isSuperAdmin) {
    return <MaintenanceMode />;
  }

  // Otherwise, render children normally
  return children;
};

export default MaintenanceModeWrapper;

