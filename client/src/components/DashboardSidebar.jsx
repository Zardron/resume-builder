import { NavLink, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, CreditCard, Settings, 
  User, Sparkles, Briefcase, Users, Calendar, 
  MessageSquare, BarChart3, Building2, UserPlus
} from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { useSidebar } from '../contexts/SidebarContext';
import LOGO from '../assets/logo.png';

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { isCollapsed } = useSidebar();
  
  const userRole = user?.role || 'applicant';
  const userType = user?.userType || user?.role || 'applicant';
  const isRecruiter = userType === 'recruiter' || userRole === 'admin' || userRole === 'manager' || userRole === 'recruiter';
  const isSuperAdmin = userRole === 'super_admin';
  
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Applicant menu items
  const applicantMenuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      label: 'My Resumes',
      path: '/dashboard/builder',
      icon: FileText
    },
    {
      label: 'My Applications',
      path: '/dashboard/applicant/applications',
      icon: Briefcase
    },
    {
      label: 'Browse Jobs',
      path: '/dashboard/applicant/jobs',
      icon: Users
    },
    {
      label: 'Interviews',
      path: '/dashboard/applicant/interviews',
      icon: Calendar
    },
    {
      label: 'Messages',
      path: '/dashboard/applicant/messages',
      icon: MessageSquare
    },
    {
      label: 'Credits',
      path: '/dashboard/purchase',
      icon: Sparkles
    },
    {
      label: 'Subscription',
      path: '/dashboard/subscription',
      icon: CreditCard
    }
  ];

  // Recruiter/Admin menu items
  const recruiterMenuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard/recruiter',
      icon: LayoutDashboard,
      exact: true
    },
    {
      label: 'Job Postings',
      path: '/dashboard/recruiter/jobs',
      icon: Briefcase,
      allowedRoles: ['admin', 'manager', 'recruiter'] // Organization Admin, Recruiter Manager, Recruiter
    },
    {
      label: 'Candidates',
      path: '/dashboard/recruiter/candidates',
      icon: Users,
      allowedRoles: ['admin', 'manager', 'recruiter'] // Organization Admin, Recruiter Manager, Recruiter
    },
    {
      label: 'Interviews',
      path: '/dashboard/recruiter/interviews',
      icon: Calendar,
      allowedRoles: ['admin', 'manager', 'recruiter'] // Organization Admin, Recruiter Manager, Recruiter
    },
    {
      label: 'Messages',
      path: '/dashboard/recruiter/messages',
      icon: MessageSquare,
      allowedRoles: ['admin', 'manager', 'recruiter'] // Organization Admin, Recruiter Manager, Recruiter
    },
    // Analytics removed - now integrated into dashboard
    {
      label: 'Team',
      path: '/dashboard/recruiter/team',
      icon: UserPlus,
      allowedRoles: ['admin', 'manager', 'super_admin'] // Organization Admin, Recruiter Manager, Super Admin
    },
    {
      label: 'Organization',
      path: '/dashboard/recruiter/organization',
      icon: Building2,
      allowedRoles: ['admin', 'super_admin'] // Organization Admin, Super Admin
    },
    {
      label: 'Billing',
      path: '/dashboard/recruiter/billing',
      icon: CreditCard,
      allowedRoles: ['admin'] // Only Organization Admin
    }
  ];

  // Common menu items
  const commonMenuItems = [
    {
      label: 'Profile',
      path: '/dashboard/profile',
      icon: User
    },
    {
      label: 'Settings',
      path: '/dashboard/settings',
      icon: Settings
    }
  ];

  // Determine which menu items to show
  let menuItems = [];
  
  if (isRecruiter) {
    // Show recruiter menu based on role permissions
    menuItems = [
      ...recruiterMenuItems.filter(item => {
        // Check if item has allowedRoles and user role is in the list
        if (item.allowedRoles) {
          return item.allowedRoles.includes(userRole);
        }
        // Legacy support for roles property
        if (item.roles) {
          return item.roles.includes(userRole) || userRole === 'super_admin';
        }
        return true;
      }),
      ...commonMenuItems
    ];
  } else {
    // Show applicant menu
    menuItems = [
      ...applicantMenuItems,
      ...commonMenuItems
    ];
  }

  return (
    <aside 
      className="fixed left-0 top-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden z-40"
      style={{ 
        height: '100vh', 
        maxHeight: '100vh',
        width: isCollapsed ? '4rem' : '16rem',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'width'
      }}
    >
      <div className="h-full overflow-y-auto">
      {/* Logo Section */}
      <div 
        className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center relative"
        style={{
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          paddingLeft: isCollapsed ? '0' : '1rem',
          paddingRight: isCollapsed ? '0' : '1rem',
          transition: 'padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1), padding-right 300ms cubic-bezier(0.4, 0, 0.2, 1), justify-content 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Link 
          to="/dashboard" 
          className="flex items-center no-underline"
          style={{
            gap: isCollapsed ? '0' : '0.5rem',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            width: isCollapsed ? '100%' : 'auto',
            transition: 'gap 300ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <img
            src={LOGO}
            alt="ResumeIQHub"
            className="h-8 object-contain flex-shrink-0"
          />
          <span 
            className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 animate-gradient bg-[length:200%_auto] block overflow-hidden whitespace-nowrap"
            style={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            ResumeIQHub
          </span>
        </Link>
      </div>
      
      <nav 
        className="space-y-1"
        style={{
          paddingTop: '1rem',
          paddingBottom: '1rem',
          paddingLeft: isCollapsed ? '0' : '1rem',
          paddingRight: isCollapsed ? '0' : '1rem',
          transition: 'padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1), padding-right 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive: navActive }) =>
                `flex items-center rounded-md py-2.5 text-sm font-medium transition-all duration-300 ${
                  navActive || active
                    ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] dark:bg-[var(--primary-color)]/20'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
              style={{
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                paddingLeft: isCollapsed ? '0' : '0.75rem',
                paddingRight: isCollapsed ? '0' : '0.75rem',
                gap: isCollapsed ? '0' : '0.75rem',
                width: isCollapsed ? '100%' : 'auto'
              }}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" style={{ display: 'block', margin: isCollapsed ? '0 auto' : '0' }} />
              <span 
                className="flex-1 overflow-hidden whitespace-nowrap"
                style={{
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto',
                  transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

