import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { initializeSocket, disconnectSocket, sendActivity, onUserBanned, getSocket } from '../../services/socketService.js';
import { logoutUser } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { authAPI } from '../../services/api';

/**
 * UserActivityTracker - Tracks user activity and sends periodic heartbeats
 * to update online/offline status via WebSocket
 */
const UserActivityTracker = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const activityTimeoutRef = useRef(null);
  const banCheckIntervalRef = useRef(null);
  const isLoggingOutRef = useRef(false);

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
    const socket = initializeSocket();

    // Function to handle user ban and logout
    const handleUserBanned = async (data) => {
      // Prevent multiple logout attempts
      if (isLoggingOutRef.current) {
        return;
      }
      isLoggingOutRef.current = true;

      // Force disconnect socket immediately
      disconnectSocket();
      
      // Logout the user
      try {
        await dispatch(logoutUser()).unwrap();
      } catch (error) {
        console.error('Error during ban logout:', error);
      }
      
      // Clear sessionStorage flag so Login page can show notification after redirect
      sessionStorage.removeItem('ban_notification_shown');
      
      // Force redirect - Login page will handle showing the notification
      // Using window.location.href causes full page reload, so notification here would be lost
      window.location.href = '/sign-in?banned=true';
    };

    // Set up ban event listener - ensure it's set up after socket connects
    let unsubscribeBan = null;
    if (socket) {
      if (socket.connected) {
        // Socket already connected, set up listener immediately
        unsubscribeBan = onUserBanned(handleUserBanned);
      } else {
        // Wait for socket to connect, then set up listener
        const connectHandler = () => {
          unsubscribeBan = onUserBanned(handleUserBanned);
        };
        socket.once('connect', connectHandler);
        // Also set up listener now in case it connects before the event fires
        unsubscribeBan = onUserBanned(handleUserBanned);
      }
    }

    // Periodic check for ban status (fallback in case socket doesn't work)
    const checkBanStatus = async () => {
      if (isLoggingOutRef.current) return;
      
      try {
        const response = await authAPI.getCurrentUser();
        // If we get a 403 or the user is banned, logout
        if (!response.success || response.data?.user?.isBanned) {
          await handleUserBanned({ message: 'Your account has been banned.' });
        }
      } catch (error) {
        // If we get a 403 ban error, logout
        if (error.isBanned || (error.status === 403 && error.message?.toLowerCase().includes('banned'))) {
          await handleUserBanned({ message: error.message || 'Your account has been banned.' });
        }
        // Ignore other errors (network, etc.)
      }
    };

    // Check ban status every 30 seconds as fallback
    banCheckIntervalRef.current = setInterval(checkBanStatus, 30000);

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
      // Remove ban listener
      if (unsubscribeBan) {
        unsubscribeBan();
      }
      // Cleanup ban check interval
      if (banCheckIntervalRef.current) {
        clearInterval(banCheckIntervalRef.current);
        banCheckIntervalRef.current = null;
      }
      // Cleanup activity tracking
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
      isLoggingOutRef.current = false;
    };
  }, [isAuthenticated, dispatch, navigate]);

  // This component doesn't render anything
  return null;
};

export default UserActivityTracker;

