import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import LoadingSkeleton from '../ui/LoadingSkeleton';

// GuestRoute - redirects authenticated users away from public pages
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  // Wait for auth to initialize before making routing decisions
  // This prevents flash of content and ensures correct routing
  if (!isInitialized) {
    // Show a minimal loading state while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton type="default" className="w-64" />
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is not authenticated, allow access to public page
  return children;
};

export default GuestRoute;

