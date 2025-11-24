import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { store } from '../../store/store';
import { initializeAuth } from '../../store/slices/authSlice';
import { fetchResumes } from '../../store/slices/resumesSlice';
import { fetchCreditsBalance, setCredits } from '../../store/slices/creditsSlice';
import { fetchSubscriptionStatus, setSubscription } from '../../store/slices/subscriptionsSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initialize = async () => {
      await dispatch(initializeAuth());
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const state = store.getState();
      const { user } = state.auth;
      
      // Sync credits from auth state
      if (user?.credits !== undefined) {
        dispatch(setCredits(user.credits));
      }
      
      // Sync subscription from auth state
      if (user?.subscription) {
        dispatch(setSubscription(user.subscription));
      }
      
      // Load user data when authenticated
      dispatch(fetchResumes());
      dispatch(fetchCreditsBalance());
      dispatch(fetchSubscriptionStatus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated]);

  // Show loading state while initializing
  if (!isInitialized) {
    return null; // Or return a loading component
  }

  return children;
};

export default AuthInitializer;

