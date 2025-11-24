import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SkipToContent from '../components/common/SkipToContent';
import BackgroundEffects from '../components/common/BackgroundEffects';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import { useSidebar } from '../contexts/SidebarContext';

const Layout = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isRecruiterRoute = location.pathname.startsWith('/dashboard/recruiter');
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');
  
  // Show sidebar for dashboard routes (but not for recruiter/admin routes which have their own AdminLayout)
  const showSidebar = isDashboardRoute && !isRecruiterRoute && !isAdminRoute;
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col relative">
      <SkipToContent />
      <BackgroundEffects />
      <Navbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {showSidebar && <DashboardSidebar />}
        <main 
          id="main-content" 
          className="flex-1 relative z-10 flex flex-col min-h-0 overflow-y-auto"
          style={{ 
            marginLeft: showSidebar ? (isCollapsed ? '4rem' : '16rem') : '0',
            transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: showSidebar ? 'margin-left' : 'auto'
          }}
          role="main" 
          tabIndex={-1}
        >
          <div className="w-full">
            <Breadcrumbs />
          </div>
          <div className="w-full flex-1">
            <Outlet />
          </div>
        </main>
      </div>
      {!isDashboardRoute && <Footer className="relative z-20 mt-auto" />}
    </div>
  );
};

export default Layout;
