import { Outlet } from 'react-router-dom';
import RecruiterSidebar from '../../components/RecruiterSidebar';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useSidebar } from '../../contexts/SidebarContext';

const RecruiterLayout = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 min-h-0">
        <RecruiterSidebar />
        <main 
          className="flex-1 flex flex-col"
          style={{ 
            marginLeft: isCollapsed ? '4.5rem' : '17rem',
            paddingTop: '2rem',
            transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'margin-left'
          }}
        >
          <div className="w-full">
            <Breadcrumbs />
          </div>
          <div className="flex-1 px-6 py-4 pb-10">
            <Outlet />
          </div>
          <Footer className="relative z-20 mt-auto" />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;

