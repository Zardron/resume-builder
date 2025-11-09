import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LOGO from '../assets/logo.png';
import ThemeSwitcher from '../util/ThemeSwitcher';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Templates', href: '/#templates' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Testimonials', href: '/#testimonials' },
];

const Navbar = () => {
  const [isLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback(
    (sectionId) => {
      const target = document.getElementById(sectionId);

      if (!target) {
        return;
      }

      const headerHeight = headerRef.current?.offsetHeight ?? 80;
      const additionalOffset = 16;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - additionalOffset;

      window.scrollTo({ top: Math.max(offsetPosition, 0), behavior: 'smooth' });
    },
    [headerRef]
  );

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);

      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, scrollToSection]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/10 dark:bg-black/10 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <header
        ref={headerRef}
        className={`flex items-center justify-between px-4 md:px-14 shadow dark:shadow-white/5 w-full transition-all sticky top-0 z-50 bg-white dark:bg-gray-900 py-4 ${
          isMenuOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2">
          <img
            src={LOGO}
            alt="Resume Builder"
            className="w-8 h-8 object-contain bg-white rounded-lg p-1 shadow-lg"
          />
          <span className="text-lg font-bold text-black dark:text-white">Resume Builder</span>
        </Link>

        {!isLoggedIn && (
          <nav className="hidden md:flex items-center gap-8 text-gray-900 dark:text-gray-100 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <span className="text-sm text-gray-900 dark:text-gray-100">
              Welcome, <span className="font-bold">Zardron</span>
            </span>
          )}
          <ThemeSwitcher />
          {isLoggedIn ? (
            <Link
              to="/sign-in"
              state={{ fromHome: true }}
              className="hidden md:flex bg-[var(--error-color)] text-white px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-80 transition"
            >
              Logout
            </Link>
          ) : (
            <Link
              to="/sign-in"
              state={{ fromHome: true }}
              className="hidden md:flex bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300"
            >
              Sign in
            </Link>
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
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 z-[60] md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className={`flex flex-col h-full ${isLoggedIn ? 'justify-between' : 'justify-end'}`}>
          <div>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex items-center gap-2">
                <img src={LOGO} alt="Resume Builder" className="w-8 h-8" />
                <span className="text-lg font-bold text-black dark:text-white">Resume Builder</span>
              </div>
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
                Welcome, <span className="font-bold">Zardron</span>
              </span>
            )}
          </div>

          {!isLoggedIn && (
            <div className="flex-1 flex flex-col p-4 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className="text-gray-900 dark:text-gray-100 text-lg font-medium hover:text-blue-500 dark:hover:text-blue-400 transition py-2 border-b border-gray-100 dark:border-slate-800"
                >
                  {link.label}
                </Link>
              ))}
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
