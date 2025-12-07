import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { useSidebar } from '../../contexts/SidebarContext';
import LOGO from '../../assets/logo.png';
import ThemeSwitcher from '../../utils/ThemeSwitcher';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Templates', href: '/#templates' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact Support', href: '/#contact-support' },
];

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLoggedIn = isAuthenticated;
  const userName = user?.fullName || user?.name || 'User';
  const userEmail = user?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();

  const scrollToSection = useCallback(
    (sectionId) => {
      const target = document.getElementById(sectionId);

      if (!target) {
        return;
      }

      const headerHeight = headerRef.current?.offsetHeight ?? 80;
      const isHome = location.pathname === '/';
      const bannerHeight = isHome ? 48 : 0; // Banner is 48px on home page
      const additionalOffset = 24; // Increased for better visibility
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - bannerHeight - additionalOffset;

      window.scrollTo({ top: Math.max(offsetPosition, 0), behavior: 'smooth' });
    },
    [headerRef, location.pathname]
  );

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);

      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, scrollToSection]);

  // Intersection Observer to detect active section
  useEffect(() => {
    if (location.pathname !== '/' || isLoggedIn) {
      setActiveSection(''); // Clear active section when not on home page
      return;
    }

    const sections = NAV_LINKS.map(link => {
      const sectionId = link.href.split('#')[1];
      const element = document.getElementById(sectionId);
      return element ? { id: sectionId, element } : null;
    }).filter(Boolean);

    if (sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -50% 0px', // Trigger when section is near top of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const sectionVisibility = new Map();

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const ratio = entry.intersectionRatio;
        sectionVisibility.set(sectionId, ratio);
      });

      // Find the section with the highest visibility ratio
      let maxRatio = 0;
      let mostVisibleSection = '';

      sectionVisibility.forEach((ratio, sectionId) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleSection = sectionId;
        }
      });

      // If no section is significantly visible, check scroll position
      if (maxRatio < 0.1) {
        const scrollPosition = window.scrollY + 150;
        let closestSection = '';
        let closestDistance = Infinity;

        sections.forEach(({ id, element }) => {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - 150);
          
          if (rect.top <= 200 && distance < closestDistance) {
            closestDistance = distance;
            closestSection = id;
          }
        });

        if (closestSection) {
          setActiveSection(closestSection);
        }
      } else if (mostVisibleSection) {
        setActiveSection(mostVisibleSection);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(({ element }) => {
      observer.observe(element);
    });

    // Set initial active section based on scroll position
    const checkInitialSection = () => {
      const scrollPosition = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight ?? 80;
      const bannerHeight = 48;
      const offset = headerHeight + bannerHeight + 50;
      
      // Check if we're at the top
      if (scrollPosition < 100) {
        setActiveSection('');
        return;
      }

      // Find the section that's currently in view
      let activeId = '';
      for (let i = sections.length - 1; i >= 0; i--) {
        const { id, element } = sections[i];
        const rect = element.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          activeId = id;
          break;
        }
      }

      if (activeId) {
        setActiveSection(activeId);
      }
    };

    // Check on mount and scroll
    checkInitialSection();
    const handleScroll = () => {
      requestAnimationFrame(checkInitialSection);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      sectionVisibility.clear();
    };
  }, [location.pathname, isLoggedIn]);

  const handleNavClick = (event, href) => {
    if (!href.startsWith('/#')) {
      setIsMenuOpen(false);
      return;
    }

    event.preventDefault();

    const sectionId = href.split('#')[1];

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      scrollToSection(sectionId);
    }

    setIsMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
    // Otherwise, let the Link handle navigation normally
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isMenuOpen || isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isProfileMenuOpen]);

  const handleProfileNavigate = (path) => {
    setIsProfileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    const isSuperAdmin = user?.role === 'super_admin';
    try {
      await dispatch(logoutUser()).unwrap();
      // Redirect super admins to admin login page
      const redirectPath = isSuperAdmin ? '/admin-login' : '/sign-in';
      navigate(redirectPath, { state: { fromHome: true } });
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate even if logout fails
      // Redirect super admins to admin login page
      const redirectPath = isSuperAdmin ? '/admin-login' : '/sign-in';
      navigate(redirectPath, { state: { fromHome: true } });
    }
  };

  // Determine top position based on route - Layout (dashboard) doesn't have Banner
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isRecruiterRoute = location.pathname.startsWith('/dashboard/recruiter');
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');
  const isApplicantRoute = location.pathname.startsWith('/dashboard/applicant');
  const isHomePage = location.pathname === '/'; // Only home page has Banner
  
  // Show sidebar for dashboard routes (including admin routes which now have Navbar)
  const hasSidebar = isDashboardRoute; // All dashboard routes have sidebars
  
  // Determine sidebar width based on route (admin/recruiter use different widths)
  const isAdminOrRecruiterRoute = isAdminRoute || isRecruiterRoute;
  const sidebarWidths = {
    collapsed: isAdminOrRecruiterRoute ? '4.5rem' : '4rem',
    expanded: isAdminOrRecruiterRoute ? '16rem' : '16rem'
  };
  
  // Get sidebar state from context (only if sidebar exists)
  let sidebarContext = null;
  try {
    sidebarContext = hasSidebar ? useSidebar() : null;
  } catch (e) {
    // Context not available, sidebar will handle its own state
  }
  
  const isCollapsed = sidebarContext?.isCollapsed || false;
  
  // Only home page has Banner (48px height), other pages should have navbar at top-0
  const topPosition = isDashboardRoute || !isHomePage ? 'top-0' : 'top-[48px]';
  const navbarClasses = hasSidebar 
    ? `fixed ${topPosition} right-0 flex items-center justify-between px-4 md:pr-6 md:pl-2 transition-all duration-300 z-50 bg-white dark:bg-gray-900 h-16 border-b border-gray-200 dark:border-gray-700 box-border ${
        isMenuOpen ? 'hidden md:flex' : 'flex'
      }`
    : `fixed ${topPosition} left-0 right-0 flex items-center justify-between px-4 md:px-16 transition-all z-50 bg-white dark:bg-gray-900 h-16 shadow-md ${
        isMenuOpen ? 'hidden md:flex' : 'flex'
      }`;

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/10 dark:bg-black/10 z-[65] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <header
        ref={headerRef}
        className={navbarClasses}
        style={hasSidebar ? { 
          left: isCollapsed ? sidebarWidths.collapsed : sidebarWidths.expanded,
          transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'left'
        } : {}}
      >
        <div className="flex items-center flex-1">
          {!hasSidebar && (
            <Link 
              to={isLoggedIn ? '/dashboard' : '/'} 
              onClick={handleLogoClick}
              className="flex items-center gap-2 no-underline"
            >
              <img
                src={LOGO}
                alt="ResumeIQHub"
                className="h-10 object-contain"
              />
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 animate-gradient bg-[length:200%_auto] block">ResumeIQHub</span>
            </Link>
          )}
        </div>

        {!isLoggedIn && (
          <nav className="hidden md:flex items-center gap-8 text-gray-900 dark:text-gray-100 text-sm absolute left-1/2 transform -translate-x-1/2">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.split('#')[1];
              const isActive = activeSection === sectionId;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className={`transition relative ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'hover:text-blue-500 dark:hover:text-blue-400'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2 flex-1 justify-end">
          {isLoggedIn && (
            <span className="text-sm text-gray-900 dark:text-gray-100">
              Welcome, <span className="font-bold">{userName}</span>
            </span>
          )}
          {isLoggedIn && (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="size-8 flex items-center justify-center rounded-md bg-gradient-to-br from-blue-500/90 to-purple-500/90 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:shadow-none cursor-pointer"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
                {userInitial}
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-md border border-gray-200/70 bg-white p-2 text-sm shadow-xl ring-1 ring-black/5 dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100">
                  <div className="px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Signed in as
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail || 'No email'}</p>
                  </div>
                  <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                  <div className="flex items-center justify-between rounded-md px-3 py-2 text-gray-700 dark:text-gray-200">
                    <span>Theme</span>
                    <ThemeSwitcher />
                  </div>
                  <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                  <button
                    onClick={() => handleProfileNavigate('/dashboard')}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <span>Dashboard</span>
                  </button>
                  {user?.role !== 'super_admin' && (
                    <button
                      onClick={() => handleProfileNavigate('/dashboard/purchase')}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <span>Buy Credits</span>
                    </button>
                  )}
                  <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                  {user?.role !== 'super_admin' && (
                    <button
                      onClick={() => handleProfileNavigate('/dashboard/profile')}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <span>Profile</span>
                    </button>
                  )}
                 {user?.role !== 'super_admin' && (
                  <button
                    onClick={() => handleProfileNavigate('/dashboard/settings')}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <span>Settings</span>
                  </button>
                 )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-medium text-[var(--error-color)] transition hover:bg-red-50 hover:text-[var(--error-color)] dark:hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {!isLoggedIn && (
           <>
            <ThemeSwitcher />
            <Link
              to="/sign-in"
              state={{ fromHome: true }}
              className="hidden md:flex bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300"
            >
              Sign in
            </Link>
           </>
          )}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <nav
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 z-[70] md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className={`flex flex-col h-full ${isLoggedIn ? 'justify-between' : 'justify-end'}`}>
          <div>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 mb-4">
              <Link 
                to={isLoggedIn ? '/dashboard' : '/'} 
                onClick={handleLogoClick}
                className="flex items-center gap-2 no-underline"
              >
                <img src={LOGO} alt="ResumeIQHub" className="w-8 h-8" />
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 animate-gradient bg-[length:200%_auto] block">ResumeIQHub</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {isLoggedIn && (
              <span className="text-sm px-4 text-gray-900 dark:text-gray-100">
                Welcome, <span className="font-bold">{userName}</span>
              </span>
            )}
          </div>

          {!isLoggedIn && (
            <div className="flex-1 flex flex-col p-4 space-y-4">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.split('#')[1];
                const isActive = activeSection === sectionId;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    className={`text-lg font-medium transition py-2 border-b border-gray-100 dark:border-slate-800 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            {isLoggedIn ? (
              <Link
                to="/sign-in"
                state={{ fromHome: true }}
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-[var(--error-color)] text-white px-4 py-3 rounded-md text-sm font-medium hover:opacity-80 transition text-center block"
              >
                Logout
              </Link>
            ) : (
              <Link
                to="/sign-in"
                state={{ fromHome: true }}
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 text-center block"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
