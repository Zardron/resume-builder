import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from './contexts/ThemeContext';
import { store } from './store/store';
import AuthInitializer from './components/common/AuthInitializer';
import ErrorBoundary from './components/common/ErrorBoundary';
import App from './App';
import './index.css';
import FullScreenLoader from './components/ui/FullScreenLoader';

const LOADER_EXIT_DURATION = 600;

// Register service worker for PWA
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const AppContainer = () => {
  const location = useLocation();
  const isAdminLoginRoute = location.pathname === '/admin-login';
  
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === 'undefined') return true;
    // Don't show loader for admin-login route
    if (window.location.pathname === '/admin-login') return false;
    return sessionStorage.getItem('resumeBuilderHasVisited') !== 'true';
  });
  const [isLoaderRendered, setIsLoaderRendered] = useState(showLoader);
  const previousOverflowRef = useRef();

  // Hide loader if on admin-login route
  useEffect(() => {
    if (isAdminLoginRoute) {
      if (showLoader) {
        setShowLoader(false);
      }
      if (isLoaderRendered) {
        setIsLoaderRendered(false);
      }
    }
  }, [isAdminLoginRoute, showLoader, isLoaderRendered]);

  useEffect(() => {
    if (!showLoader) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('resumeBuilderHasVisited', 'true');
      }
      return;
    }

    const timeoutId = setTimeout(() => setShowLoader(false), 7200);
    return () => clearTimeout(timeoutId);
  }, [showLoader]);

  useEffect(() => {
    if (showLoader) {
      setIsLoaderRendered(true);
      return undefined;
    }

    const exitTimeoutId = setTimeout(() => setIsLoaderRendered(false), LOADER_EXIT_DURATION);
    return () => clearTimeout(exitTimeoutId);
  }, [showLoader]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const { body } = document;

    if (isLoaderRendered) {
      previousOverflowRef.current = body.style.overflow;
      body.style.overflow = 'hidden';
      body.classList.add('initial-loader-active');

      return () => {
        body.style.overflow = previousOverflowRef.current ?? '';
        previousOverflowRef.current = undefined;
        body.classList.remove('initial-loader-active');
      };
    }

    body.classList.remove('initial-loader-active');
    if (previousOverflowRef.current !== undefined) {
      body.style.overflow = previousOverflowRef.current;
      previousOverflowRef.current = undefined;
    } else {
      body.style.overflow = '';
    }

    return undefined;
  }, [isLoaderRendered]);

  // Don't render loader on admin-login route
  const shouldShowLoader = isLoaderRendered && !isAdminLoginRoute;

  return (
    <>
      {shouldShowLoader && <FullScreenLoader isExiting={!showLoader} />}
      <div
        className="app-shell"
        aria-hidden={showLoader && !isAdminLoginRoute}
        style={showLoader && !isAdminLoginRoute ? { visibility: 'hidden' } : undefined}
      >
        <App />
      </div>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AuthInitializer>
            <BrowserRouter>
              <AppContainer />
            </BrowserRouter>
          </AuthInitializer>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
