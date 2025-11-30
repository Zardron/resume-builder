import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import { useSidebar } from '../../contexts/SidebarContext';

const AdminLayout = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main 
          className="flex-1 flex flex-col overflow-x-hidden"
          style={{ 
            marginLeft: isCollapsed ? '4.5rem' : '17rem',
            paddingTop: '4rem',
            transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'margin-left'
          }}
        >
          <div className="w-full">
            <Breadcrumbs />
          </div>
          <div className="flex-1 px-6 py-4 pb-10 overflow-x-hidden max-w-full">
            <Outlet />
          </div>
          <Footer className="relative z-20 mt-auto" />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

