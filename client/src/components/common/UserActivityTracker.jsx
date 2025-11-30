import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import { initializeSocket, disconnectSocket, sendActivity } from '../../services/socketService.js';

/**
 * UserActivityTracker - Tracks user activity and sends periodic heartbeats
 * to update online/offline status via WebSocket
 */
const UserActivityTracker = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const intervalRef = useRef(null);
  const activityTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect socket if user is not authenticated
      disconnectSocket();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
        activityTimeoutRef.current = null;
      }
      return;
    }

    // Initialize socket connection
    initializeSocket();

    // Throttled activity sender (max once per 5 seconds)
    const sendActivityThrottled = () => {
      if (activityTimeoutRef.current) {
        return; // Already scheduled
      }
      
      activityTimeoutRef.current = setTimeout(() => {
        sendActivity();
        activityTimeoutRef.current = null;
      }, 5000); // Throttle to max once per 5 seconds
    };

    // Send activity immediately
    sendActivityThrottled();

    // Set up interval to send activity every 30 seconds
    intervalRef.current = setInterval(() => {
      sendActivityThrottled();
    }, 30000); // 30 seconds

    // Also send activity on user interactions (throttled)
    const handleUserActivity = () => {
      sendActivityThrottled();
    };

    // Track user interactions (mouse movement, clicks, keyboard)
    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('click', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
        activityTimeoutRef.current = null;
      }
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [isAuthenticated]);

  // This component doesn't render anything
  return null;
};

export default UserActivityTracker;

