import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    return saved === 'dark';
  }
  // Detect system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-update if user hasn't manually set a preference
      const saved = localStorage.getItem('theme');
      if (!saved || saved === 'auto') {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);
  const setTheme = (theme) => {
    if (theme === 'auto') {
      localStorage.removeItem('theme');
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDark(theme === 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
