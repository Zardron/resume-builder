import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredCredits, setStoredCredits, incrementCredits, decrementCredits } from '../utils/creditUtils';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Zardron',
    email: 'zardron@example.com',
    isLoggedIn: true,
  });

  const [credits, setCredits] = useState(getStoredCredits());
  const [resumes, setResumes] = useState([
    { id: '1', name: "Zardron's Resume", date: '10/24/2025', template: 'modern' },
    { id: '2', name: "Alaine's Resume", date: '10/24/2025', template: 'classic' },
    { id: '3', name: "Zaine's Resume", date: '10/24/2025', template: 'minimal' },
  ]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Subscription status

  // Sync credits with localStorage
  useEffect(() => {
    const handleStorage = () => {
      setCredits(getStoredCredits());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Credit management
  const addCredits = useCallback((amount) => {
    const newCredits = incrementCredits(amount);
    setCredits(newCredits);
    return newCredits;
  }, []);

  const useCredits = useCallback((amount) => {
    const newCredits = decrementCredits(amount);
    setCredits(newCredits);
    return newCredits;
  }, []);

  const updateCredits = useCallback((amount) => {
    const newCredits = setStoredCredits(amount);
    setCredits(newCredits);
    return newCredits;
  }, []);

  // Resume management
  const addResume = useCallback((resume) => {
    const newResume = {
      id: Date.now().toString(),
      ...resume,
      date: new Date().toLocaleDateString(),
    };
    setResumes(prev => [newResume, ...prev]);
    return newResume;
  }, []);

  const updateResume = useCallback((id, updates) => {
    setResumes(prev =>
      prev.map(resume =>
        resume.id === id ? { ...resume, ...updates, date: new Date().toLocaleDateString() } : resume
      )
    );
  }, []);

  const deleteResume = useCallback((id) => {
    setResumes(prev => prev.filter(resume => resume.id !== id));
  }, []);

  const getResume = useCallback((id) => {
    return resumes.find(resume => resume.id === id);
  }, [resumes]);

  // Notification management
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };
    setNotifications(prev => [...prev, newNotification]);

    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // User management
  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const logout = useCallback(() => {
    setUser({
      name: '',
      email: '',
      isLoggedIn: false,
    });
    setResumes([]);
    setCredits(0);
  }, []);

  const value = {
    // User
    user,
    updateUser,
    logout,

    // Credits
    credits,
    addCredits,
    useCredits,
    updateCredits,

    // Resumes
    resumes,
    addResume,
    updateResume,
    deleteResume,
    getResume,

    // Notifications
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,

    // Loading
    isLoading,
    setIsLoading,

    // Subscription
    isSubscribed,
    setIsSubscribed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

