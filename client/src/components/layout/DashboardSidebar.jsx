import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, CreditCard, Settings, 
  User, Sparkles, Briefcase, Users, Calendar, 
  MessageSquare, BarChart3, Building2, UserPlus,
  PanelLeftClose, PanelLeftOpen, LogOut, Moon, Sun,
  HelpCircle
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { useSidebar } from '../../contexts/SidebarContext';
import ThemeSwitcher from '../../utils/ThemeSwitcher';
import LOGO from '../../assets/logo.png';

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  const userRole = user?.role || 'applicant';
  const userType = user?.userType || user?.role || 'applicant';
  const isRecruiter = userType === 'recruiter' || userRole === 'admin' || userRole === 'manager' || userRole === 'recruiter';
  const isSuperAdmin = userRole === 'super_admin';

  const handleLogout = async () => {
    const isSuperAdmin = user?.role === 'super_admin';
    try {
      await dispatch(logoutUser()).unwrap();
      const redirectPath = isSuperAdmin ? '/admin-login' : '/sign-in';
      navigate(redirectPath, { state: { fromHome: true } });
    } catch (error) {
      console.error('Logout error:', error);
      const redirectPath = isSuperAdmin ? '/admin-login' : '/sign-in';
      navigate(redirectPath, { state: { fromHome: true } });
    }
  };
  
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Applicant menu items organized by category
  const applicantMenuCategories = [
    {
      label: 'Main',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
          exact: true
        }
      ]
    },
    {
      label: 'Resume & Applications',
      items: [
        {
          label: 'Resume Builder',
          path: '/dashboard/builder',
          icon: FileText
        },
        {
          label: 'My Applications',
          path: '/dashboard/applicant/applications',
          icon: Briefcase
        }
      ]
    },
    {
      label: 'Job Search',
      items: [
        {
          label: 'Browse Jobs',
          path: '/dashboard/applicant/jobs',
          icon: Users
        },
        {
          label: 'Interviews',
          path: '/dashboard/applicant/interviews',
          icon: Calendar
        }
      ]
    },
    {
      label: 'Communication',
      items: [
        {
          label: 'Messages',
          path: '/dashboard/applicant/messages',
          icon: MessageSquare
        }
      ]
    },
    {
      label: 'Billing & Support',
      items: [
        {
          label: 'Credits',
          path: '/dashboard/purchase',
          icon: Sparkles
        },
        {
          label: 'Subscription',
          path: '/dashboard/subscription',
          icon: CreditCard
        },
        {
          label: 'Help & Support',
          path: '/dashboard/applicant/support',
          icon: HelpCircle
        }
      ]
    }
  ];

  // Recruiter/Admin menu items organized by category
  const recruiterMenuCategories = [
    {
      label: 'Main',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard/recruiter',
          icon: LayoutDashboard,
          exact: true
        }
      ]
    },
    {
      label: 'Recruitment',
      items: [
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
        }
      ]
    },
    {
      label: 'Communication',
      items: [
        {
          label: 'Messages',
          path: '/dashboard/recruiter/messages',
          icon: MessageSquare,
          allowedRoles: ['admin', 'manager', 'recruiter'] // Organization Admin, Recruiter Manager, Recruiter
        }
      ]
    },
    {
      label: 'Team & Organization',
      items: [
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
        }
      ]
    },
    {
      label: 'Billing',
      items: [
        {
          label: 'Billing',
          path: '/dashboard/recruiter/billing',
          icon: CreditCard,
          allowedRoles: ['admin'] // Only Organization Admin
        }
      ]
    }
  ];

  // Determine which menu categories to show (without Profile and Settings - they go in bottom menu)
  let menuCategories = [];
  
  if (isRecruiter) {
    // Show recruiter menu categories based on role permissions
    menuCategories = recruiterMenuCategories.map(category => ({
      ...category,
      items: category.items.filter(item => {
        // Check if item has allowedRoles and user role is in the list
        if (item.allowedRoles) {
          return item.allowedRoles.includes(userRole);
        }
        // Legacy support for roles property
        if (item.roles) {
          return item.roles.includes(userRole) || userRole === 'super_admin';
        }
        return true;
      })
    })).filter(category => category.items.length > 0); // Only show categories with visible items
  } else {
    // Show applicant menu categories
    menuCategories = applicantMenuCategories;
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
      <div className="h-full flex flex-col overflow-hidden">
        {/* Logo Section */}
        <div
          className={`h-16 border-b border-gray-200 dark:border-gray-700 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } ${isCollapsed ? "px-0" : "px-4"} shrink-0 box-border`}
        >
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 no-underline group ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <img
              src={LOGO}
              alt="ResumeIQHub"
              className="h-8 w-8 object-contain flex-shrink-0 transition-transform group-hover:scale-105"
            />
            <span
              className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 whitespace-nowrap"
              style={{
                display: isCollapsed ? "none" : "block",
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : "auto",
                overflow: "hidden",
                transition:
                  "opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              ResumeIQHub
            </span>
          </Link>

          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="space-y-2.5">
            {menuCategories.map((category, categoryIndex) => (
              <div key={category.label} className="space-y-0.5">
                {/* Category Label */}
                {!isCollapsed && (
                  <div
                    className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1"
                    style={{
                      display: isCollapsed ? "none" : "block",
                      opacity: isCollapsed ? 0 : 1,
                      transition:
                        "opacity 200ms ease-in-out",
                    }}
                  >
                    {category.label}
                  </div>
                )}
                
                {/* Category Items */}
                <div className="space-y-0.5">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <div
                        key={item.path}
                        className={`relative group ${
                          isCollapsed ? "flex justify-center" : ""
                        }`}
                      >
                        <NavLink
                          to={item.path}
                          end={item.exact}
                          className={({ isActive: navActive }) =>
                            `flex items-center ${
                              isCollapsed ? "justify-center" : ""
                            } rounded-md ${
                              isCollapsed
                                ? "py-2 px-2 w-10 h-10"
                                : "py-1.5 px-3 w-full"
                            } text-sm font-medium transition-all duration-200 relative ${
                              navActive || active
                                ? isCollapsed
                                  ? "bg-gray-100 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400"
                                  : "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }`
                          }
                          title={isCollapsed ? item.label : ""}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                          <span
                            className="ml-3 flex-1 whitespace-nowrap"
                            style={{
                              display: isCollapsed ? "none" : "block",
                              opacity: isCollapsed ? 0 : 1,
                              width: isCollapsed ? 0 : "auto",
                              overflow: "hidden",
                              transition:
                                "opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          >
                            {item.label}
                          </span>

                          {active && !isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                          )}

                          {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                              {item.label}
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                            </div>
                          )}
                        </NavLink>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>
      
      {/* Bottom Menu Section */}
      <div className="mt-auto border-t border-gray-200 dark:border-gray-700">
        <div
          className={`p-1.5 space-y-0.5 ${
            isCollapsed ? "flex flex-col items-center" : ""
          }`}
        >
          {/* Account Category Label */}
          {!isCollapsed && (
            <div
              className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1"
              style={{
                display: isCollapsed ? "none" : "block",
                opacity: isCollapsed ? 0 : 1,
                transition:
                  "opacity 200ms ease-in-out",
              }}
            >
              Account
            </div>
          )}
          {/* Profile */}
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : ""
              } rounded-md ${
                isCollapsed ? "py-2 px-2 w-10 h-10" : "py-1.5 px-3 w-full"
              } text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? isCollapsed
                    ? "bg-gray-100 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400"
                    : "bg-[var(--primary-color)]/10 text-[var(--primary-color)] dark:bg-[var(--primary-color)]/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`
            }
            title={isCollapsed ? "Profile" : ""}
          >
            <User className="h-5 w-5 flex-shrink-0" />
            <span
              className="ml-3 flex-1 whitespace-nowrap"
              style={{
                display: isCollapsed ? "none" : "block",
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : "auto",
                overflow: "hidden",
                transition:
                  "opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Profile
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                Profile
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
              </div>
            )}
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : ""
              } rounded-md ${
                isCollapsed ? "py-2 px-2 w-10 h-10" : "py-1.5 px-3 w-full"
              } text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? isCollapsed
                    ? "bg-gray-100 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400"
                    : "bg-[var(--primary-color)]/10 text-[var(--primary-color)] dark:bg-[var(--primary-color)]/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`
            }
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span
              className="ml-3 flex-1 whitespace-nowrap"
              style={{
                display: isCollapsed ? "none" : "block",
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : "auto",
                overflow: "hidden",
                transition:
                  "opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Settings
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                Settings
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
              </div>
            )}
          </NavLink>

          {/* Theme Switcher */}
          {!isCollapsed && (
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } rounded-md ${
                isCollapsed ? "py-2 px-2 w-10 h-10" : "py-1.5 px-3 w-full"
              } text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group relative`}
            >
              <Moon className="h-5 w-5 flex-shrink-0 dark:hidden" />
              <Sun className="h-5 w-5 flex-shrink-0 hidden dark:block" />
              <span
                className="ml-3 flex-1 whitespace-nowrap"
                style={{
                  display: isCollapsed ? "none" : "block",
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : "auto",
                  overflow: "hidden",
                  transition:
                    "opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Theme
              </span>
              <div
                className="ml-auto"
                style={{
                  display: isCollapsed ? "none" : "block",
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : "auto",
                  overflow: "hidden",
                  transition:
                    "opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <ThemeSwitcher />
              </div>
            </div>
          )}
          {isCollapsed && <ThemeSwitcher />}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`${
              isCollapsed ? "w-10 h-10" : "w-full"
            } flex items-center ${
              isCollapsed ? "justify-center" : ""
            } rounded-md ${
              isCollapsed ? "py-2 px-2" : "py-1.5 px-3"
            } text-sm font-medium text-[var(--error-color)] hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group relative`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span
              className="ml-3 flex-1 whitespace-nowrap text-left"
              style={{
                display: isCollapsed ? "none" : "block",
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : "auto",
                overflow: "hidden",
                transition:
                  "opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Logout
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                Logout
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
              </div>
            )}
          </button>
        </div>
      </div>
      
      {/* Collapsed Toggle Button at Bottom */}
      {isCollapsed && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className={`${isCollapsed ? 'w-10 h-10 mx-auto' : 'w-full'} flex items-center justify-center rounded-md ${isCollapsed ? 'py-2 px-2' : 'py-2.5 px-3'} text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200`}
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-5 w-5 flex-shrink-0 text-gray-600 dark:text-gray-400" />
            <span 
              className="ml-3 flex-1 whitespace-nowrap"
              style={{
                display: isCollapsed ? 'none' : 'block',
                opacity: 0,
                width: 0,
                overflow: 'hidden'
              }}
            >
              Expand
            </span>
          </button>
        </div>
      )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;

