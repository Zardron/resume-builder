import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, removeToken } from '../services/api.js';
import { authAPI, resumeAPI, creditsAPI, subscriptionAPI } from '../services/api.js';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    isLoggedIn: false,
  });

  const [credits, setCredits] = useState(0);
  const [resumes, setResumes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize app - check if user is logged in
  useEffect(() => {
    const initializeApp = async () => {
      const token = getToken();
      if (token) {
        try {
          setIsLoading(true);
          const response = await authAPI.getCurrentUser();
          
          if (response.success && response.data?.user) {
            const userData = response.data.user;
            setUser({
              id: userData.id,
              name: userData.fullName || userData.name,
              fullName: userData.fullName,
              email: userData.email,
              isLoggedIn: true,
              role: userData.role,
              profile: userData.profile,
              preferences: userData.preferences,
              resumeDefaults: userData.resumeDefaults,
              stats: userData.stats,
            });
            
            setCredits(userData.credits || 0);
            setIsSubscribed(userData.subscription?.status === 'active');
            
            // Load resumes
            await loadResumes();
          } else {
            // Invalid token, clear it
            removeToken();
          }
        } catch (error) {
          console.error('Failed to initialize app:', error);
          removeToken();
        } finally {
          setIsLoading(false);
          setIsInitialized(true);
        }
      } else {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Load resumes from API
  const loadResumes = useCallback(async () => {
    try {
      const resumesData = await resumeAPI.getAll();
      setResumes(resumesData.map(resume => ({
        id: resume._id || resume.id,
        name: resume.name,
        date: new Date(resume.updatedAt || resume.createdAt).toLocaleDateString(),
        template: resume.template,
        isDraft: resume.isDraft,
        ...resume,
      })));
    } catch (error) {
      console.error('Failed to load resumes:', error);
    }
  }, []);

  // Refresh credits from API
  const refreshCredits = useCallback(async () => {
    try {
      const balance = await creditsAPI.getBalance();
      setCredits(balance);
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  }, []);

  // Credit management
  const addCredits = useCallback((amount) => {
    setCredits(prev => prev + amount);
    refreshCredits(); // Sync with backend
    return credits + amount;
  }, [credits, refreshCredits]);

  const useCredits = useCallback((amount) => {
    if (credits < amount) {
      return -1; // Insufficient credits
    }
    const newCredits = credits - amount;
    setCredits(newCredits);
    refreshCredits(); // Sync with backend
    return newCredits;
  }, [credits, refreshCredits]);

  const updateCredits = useCallback((amount) => {
    setCredits(amount);
    return amount;
  }, []);

  // Resume management
  const addResume = useCallback(async (resumeData) => {
    try {
      const newResume = await resumeAPI.create(resumeData);
      await loadResumes(); // Reload from API
      return {
        id: newResume._id || newResume.id,
        name: newResume.name,
        date: new Date(newResume.updatedAt || newResume.createdAt).toLocaleDateString(),
        template: newResume.template,
        ...newResume,
      };
    } catch (error) {
      console.error('Failed to create resume:', error);
      throw error;
    }
  }, [loadResumes]);

  const updateResume = useCallback(async (id, updates) => {
    try {
      const updatedResume = await resumeAPI.update(id, updates);
      await loadResumes(); // Reload from API
      return updatedResume;
    } catch (error) {
      console.error('Failed to update resume:', error);
      throw error;
    }
  }, [loadResumes]);

  const deleteResume = useCallback(async (id) => {
    try {
      await resumeAPI.delete(id);
      await loadResumes(); // Reload from API
    } catch (error) {
      console.error('Failed to delete resume:', error);
      throw error;
    }
  }, [loadResumes]);

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
    setUser(prev => {
      const updated = { ...prev, ...updates };
      
      // Update subscription status if subscription data is provided
      if (updates.subscription) {
        setIsSubscribed(updates.subscription.status === 'active');
      }
      
      // Update credits if provided
      if (updates.credits !== undefined) {
        setCredits(updates.credits);
      }
      
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser({
        name: '',
        email: '',
        isLoggedIn: false,
      });
      setResumes([]);
      setCredits(0);
      setIsSubscribed(false);
      removeToken();
    }
  }, []);

  const value = {
    // User
    user,
    updateUser,
    logout,
    isInitialized,

    // Credits
    credits,
    addCredits,
    useCredits,
    updateCredits,
    refreshCredits,

    // Resumes
    resumes,
    addResume,
    updateResume,
    deleteResume,
    getResume,
    loadResumes,

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
