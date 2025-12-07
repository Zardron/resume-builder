import { useState } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Calendar, 
  MessageSquare, Settings, Building2,
  CreditCard, UserPlus, ChevronRight, PanelLeftClose, PanelLeftOpen,
  User, Sparkles, Moon, Sun, LogOut, BarChart3
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { useSidebar } from '../../contexts/SidebarContext';
import LOGO from '../../assets/logo.png';
import ThemeSwitcher from '../../utils/ThemeSwitcher';

const RecruiterSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [expandedItems, setExpandedItems] = useState([]);
  
  const userRole = user?.role || 'user';
  const userType = user?.userType || 'recruiter';
  const basePath = '/dashboard/recruiter';
  
  // Determine effective role for menu filtering
  // For recruiters, role can be 'admin' (org admin), 'manager', or 'user' (with userType 'recruiter' or 'both')
  const effectiveRole = userRole === 'user' && (userType === 'recruiter' || userType === 'both') 
    ? 'recruiter' 
    : userRole;
  
  const isActive = (path) => {
    if (path === basePath) {
      return location.pathname === basePath;
    }
    return location.pathname.startsWith(path);
  };

  const toggleExpanded = (path) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const handleLogout = async () => {
    const isSuperAdmin = user?.role === 'super_admin';
    try {
      await dispatch(logoutUser()).unwrap();
      // Redirect super admins to admin login page
      const redirectPath = isSuperAdmin ? '/admin-login' : '/sign-in';
      navigate(redirectPath, { state: { fromHome: true } });
    } catch (error) {
      console.error('Logout error:', error);
      // Redirect super admins to admin login page
      const redirectPath = isSuperAdmin ? '/admin-login' : '/sign-in';
      navigate(redirectPath, { state: { fromHome: true } });
    }
  };

  // Recruiter-specific menu items
  const menuItems = [
    {
      label: 'Dashboard',
      path: basePath,
      icon: LayoutDashboard,
      exact: true,
      allowedRoles: ['admin', 'manager', 'recruiter']
    },
    {
      label: 'Job Postings',
      path: `${basePath}/jobs`,
      icon: Briefcase,
      submenu: [
        { label: 'All Jobs', path: `${basePath}/jobs` },
        { label: 'Create Job', path: `${basePath}/jobs/new` },
        { label: 'Drafts', path: `${basePath}/jobs?status=draft` }
      ],
      allowedRoles: ['admin', 'manager', 'recruiter']
    },
    {
      label: 'Candidates',
      path: `${basePath}/candidates`,
      icon: Users,
      submenu: [
        { label: 'Pipeline', path: `${basePath}/candidates` },
        { label: 'All Candidates', path: `${basePath}/candidates?view=all` },
        { label: 'Favorites', path: `${basePath}/candidates?view=favorites` }
      ],
      allowedRoles: ['admin', 'manager', 'recruiter']
    },
    {
      label: 'Interviews',
      path: `${basePath}/interviews`,
      icon: Calendar,
      submenu: [
        { label: 'Calendar', path: `${basePath}/interviews` },
        { label: 'Schedule', path: `${basePath}/interviews/new` },
        { label: 'Upcoming', path: `${basePath}/interviews?status=upcoming` }
      ],
      allowedRoles: ['admin', 'manager', 'recruiter']
    },
    {
      label: 'Messages',
      path: `${basePath}/messages`,
      icon: MessageSquare,
      badge: 0,
      allowedRoles: ['admin', 'manager', 'recruiter']
    },
    {
      label: 'Analytics',
      path: `${basePath}/analytics`,
      icon: BarChart3,
      allowedRoles: ['admin', 'manager', 'recruiter']
    },
    {
      label: 'Team',
      path: `${basePath}/team`,
      icon: UserPlus,
      allowedRoles: ['admin', 'manager'] // Only org admins and managers
    },
    {
      label: 'Organization',
      path: `${basePath}/organization`,
      icon: Building2,
      allowedRoles: ['admin'] // Only org admins
    },
    {
      label: 'Billing',
      path: `${basePath}/billing`,
      icon: CreditCard,
      allowedRoles: ['admin'] // Only org admins
    }
  ];
  
  const filteredMenuItems = menuItems.filter(item => {
    if (item.allowedRoles) {
      return item.allowedRoles.includes(effectiveRole);
    }
    return true;
  });

  return (
    <aside 
      className="fixed left-0 top-0 h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-40 shadow-sm"
      style={{ 
        width: isCollapsed ? '4.5rem' : '16rem',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Logo Section */}
        <div className={`h-16 border-b border-gray-200 dark:border-gray-700 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} ${isCollapsed ? 'px-0' : 'px-4'} shrink-0 box-border`}>
          <Link 
            to={basePath} 
            className={`flex items-center gap-2 no-underline group ${isCollapsed ? 'justify-center w-full' : ''}`}
          >
            <img
              src={LOGO}
              alt="ResumeIQHub"
              className="h-8 w-8 object-contain flex-shrink-0 transition-transform group-hover:scale-105"
            />
            <span 
              className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 whitespace-nowrap"
              style={{
                display: isCollapsed ? 'none' : 'block',
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : 'auto',
                overflow: 'hidden',
                transition: 'opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              ResumeIQHub
            </span>
          </Link>
          
          {/* Toggle Button */}
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
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedItems.includes(item.path);
              
              return (
                <div key={item.path} className={`relative group ${isCollapsed ? 'flex justify-center' : ''}`}>
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    onClick={(e) => {
                      if (hasSubmenu && !isCollapsed) {
                        e.preventDefault();
                        toggleExpanded(item.path);
                      }
                    }}
                    className={({ isActive: navActive }) =>
                      `flex items-center ${isCollapsed ? 'justify-center' : ''} rounded-md ${isCollapsed ? 'py-2 px-2 w-10 h-10' : 'py-2.5 px-3 w-full'} text-sm font-medium transition-all duration-200 relative ${
                        navActive || active
                          ? isCollapsed 
                            ? 'bg-gray-100 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400'
                            : 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`
                    }
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon 
                      className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" 
                    />
                    <span 
                      className="ml-3 flex-1 whitespace-nowrap"
                      style={{
                        display: isCollapsed ? 'none' : 'block',
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : 'auto',
                        overflow: 'hidden',
                        transition: 'opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {item.label}
                    </span>
                    
                    {/* Badge */}
                    {item.badge !== undefined && item.badge > 0 && !isCollapsed && (
                      <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Submenu Indicator */}
                    {hasSubmenu && !isCollapsed && (
                      <ChevronRight 
                        className={`h-4 w-4 ml-auto transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                    
                    {/* Active Indicator */}
                    {active && !isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                    )}
                  </NavLink>
                  
                  {/* Submenu */}
                  {hasSubmenu && (isExpanded || active) && !isCollapsed && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 animate-in slide-in-from-top-2">
                      {item.submenu.map((subItem) => {
                        const subActive = location.pathname === subItem.path || 
                          (subItem.path.includes('?') && location.pathname === subItem.path.split('?')[0]);
                        
                        return (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive: subNavActive }) =>
                              `block rounded-md px-3 py-2 text-xs font-medium transition-all duration-200 ${
                                subNavActive || subActive
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                      {item.label}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-semibold">
                          {item.badge}
                        </span>
                      )}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
        </nav>
        
        {/* Bottom Profile Menu Section */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className={`p-2 space-y-1 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {/* Buy Credits */}
            <NavLink
              to="/dashboard/purchase"
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : ''} rounded-md ${isCollapsed ? 'py-2 px-2 w-10 h-10' : 'py-2.5 px-3 w-full'} text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? isCollapsed 
                      ? 'bg-gray-100 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400'
                      : 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`
              }
              title={isCollapsed ? 'Buy Credits' : ''}
            >
              <Sparkles className="h-5 w-5 flex-shrink-0" />
              <span 
                className="ml-3 flex-1 whitespace-nowrap"
                style={{
                  display: isCollapsed ? 'none' : 'block',
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto',
                  overflow: 'hidden',
                  transition: 'opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Buy Credits
              </span>
              {isActive('/dashboard/purchase') && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                  Buy Credits
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                </div>
              )}
            </NavLink>
            
            {/* Profile */}
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : ''} rounded-md ${isCollapsed ? 'py-2 px-2 w-10 h-10' : 'py-2.5 px-3 w-full'} text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? isCollapsed 
                      ? 'bg-gray-100 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400'
                      : 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`
              }
              title={isCollapsed ? 'Profile' : ''}
            >
              <User className="h-5 w-5 flex-shrink-0" />
              <span 
                className="ml-3 flex-1 whitespace-nowrap"
                style={{
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto',
                  overflow: 'hidden',
                  transition: 'opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Profile
              </span>
              {isActive('/dashboard/profile') && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
              )}
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
                `flex items-center ${isCollapsed ? 'justify-center' : ''} rounded-md ${isCollapsed ? 'py-2 px-2 w-10 h-10' : 'py-2.5 px-3 w-full'} text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? isCollapsed 
                      ? 'bg-gray-100 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400'
                      : 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`
              }
              title={isCollapsed ? 'Settings' : ''}
            >
              <Settings className="h-5 w-5 flex-shrink-0 transition-transform hover:rotate-90" />
              <span 
                className="ml-3 flex-1 whitespace-nowrap"
                style={{
                  display: isCollapsed ? 'none' : 'block',
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto',
                  overflow: 'hidden',
                  transition: 'opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Settings
              </span>
              {isActive('/dashboard/settings') && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                  Settings
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                </div>
              )}
            </NavLink>
            
            {/* Theme Switcher */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} rounded-md ${isCollapsed ? 'py-2 px-2 w-10 h-10' : 'py-2.5 px-3 w-full'} text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group relative`}>
              <Moon className="h-5 w-5 flex-shrink-0 dark:hidden" />
              <Sun className="h-5 w-5 flex-shrink-0 hidden dark:block" />
              <span 
                className="ml-3 flex-1 whitespace-nowrap"
                style={{
                  display: isCollapsed ? 'none' : 'block',
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto',
                  overflow: 'hidden',
                  transition: 'opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Theme
              </span>
              <div 
                className="ml-auto"
                style={{
                  display: isCollapsed ? 'none' : 'block',
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto',
                  overflow: 'hidden',
                  transition: 'opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <ThemeSwitcher />
              </div>
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                  Theme
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                </div>
              )}
            </div>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`${isCollapsed ? 'w-10 h-10' : 'w-full'} flex items-center ${isCollapsed ? 'justify-center' : ''} rounded-md ${isCollapsed ? 'py-2 px-2' : 'py-2.5 px-3'} text-sm font-medium text-[var(--error-color)] hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group relative`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span 
                className="ml-3 flex-1 whitespace-nowrap text-left"
                style={{
                  display: isCollapsed ? 'none' : 'block',
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto',
                  overflow: 'hidden',
                  transition: 'opacity 200ms ease-in-out, width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
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

export default RecruiterSidebar;

