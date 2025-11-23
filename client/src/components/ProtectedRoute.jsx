import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * ProtectedRoute - Route guard for role-based access control
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if access granted
 * @param {Array<string>} props.allowedRoles - Array of allowed roles (e.g., ['recruiter', 'admin'])
 * @param {Array<string>} props.allowedUserTypes - Array of allowed user types (e.g., ['recruiter', 'applicant'])
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  allowedUserTypes = [],
  requireAuth = true 
}) => {
  const { isAuthenticated, isInitialized, user } = useAppSelector((state) => state.auth);

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

  // If auth is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // If no role/userType restrictions, allow access
  if (allowedRoles.length === 0 && allowedUserTypes.length === 0) {
    return children;
  }

  // Check role and user type restrictions
  // If both are provided, user must match at least one (OR logic)
  // If only one is provided, user must match that one
  if (allowedRoles.length > 0 || allowedUserTypes.length > 0) {
    const userRole = user?.role || 'applicant';
    const userType = user?.userType || user?.role || 'applicant';
    
    // Check if user matches role OR userType
    const matchesRole = allowedRoles.length > 0 && allowedRoles.includes(userRole);
    const matchesUserType = allowedUserTypes.length > 0 && allowedUserTypes.includes(userType);
    
    // If both restrictions are provided, user must match at least one
    // If only one is provided, user must match that one
    if (allowedRoles.length > 0 && allowedUserTypes.length > 0) {
      // Both provided: OR logic
      if (!matchesRole && !matchesUserType) {
        return <Navigate to="/dashboard" replace />;
      }
    } else if (allowedRoles.length > 0) {
      // Only roles provided
      if (!matchesRole) {
        return <Navigate to="/dashboard" replace />;
      }
    } else if (allowedUserTypes.length > 0) {
      // Only userTypes provided
      if (!matchesUserType) {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;

