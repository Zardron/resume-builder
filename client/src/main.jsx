import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import App from './App';
import './index.css';
import FullScreenLoader from './components/FullScreenLoader';

const LOADER_EXIT_DURATION = 600;

const AppContainer = () => {
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('resumeBuilderHasVisited') !== 'true';
  });
  const [isLoaderRendered, setIsLoaderRendered] = useState(showLoader);
  const previousOverflowRef = useRef();

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

  return (
    <>
      {isLoaderRendered && <FullScreenLoader isExiting={!showLoader} />}
      <div
        className="app-shell"
        aria-hidden={showLoader}
        style={showLoader ? { visibility: 'hidden' } : undefined}
      >
        <App />
      </div>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppContainer />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
