import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import ApplicantDashboard from './ApplicantDashboard';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  // Determine user type and route accordingly
  const userType = user?.userType || user?.role || 'applicant';
  const userRole = user?.role || 'applicant';
  const isRecruiter = userType === 'recruiter' || userRole === 'admin' || userRole === 'manager' || userRole === 'recruiter';
  const isSuperAdmin = userRole === 'super_admin';
  
  // Redirect recruiters/admins (except super admin) to recruiter dashboard
  if (isRecruiter && !isSuperAdmin) {
    return <Navigate to="/dashboard/recruiter" replace />;
  }
  
  // Super admin should go to admin dashboard
  if (isSuperAdmin) {
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  // Show applicant dashboard
  return <ApplicantDashboard />;
};

export default Dashboard;
