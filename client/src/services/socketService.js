import { io } from 'socket.io-client';
import { getToken } from './api.js';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Initialize Socket.io connection
 */
export const initializeSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const token = getToken();
  if (!token) {
    return null;
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const baseURL = API_URL.replace('/api', '');

  socket = io(baseURL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    reconnectAttempts = 0;
    
    // Update token if it changed
    const newToken = getToken();
    if (newToken) {
      socket.auth.token = newToken;
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    
    // Try to reconnect with updated token if available
    if (reason === 'io server disconnect') {
      // Server disconnected, try to reconnect
      const newToken = getToken();
      if (newToken) {
        socket.auth.token = newToken;
        socket.connect();
      }
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    reconnectAttempts++;
    
    // Update token and retry if auth error
    if (error.message?.includes('Authentication')) {
      const newToken = getToken();
      if (newToken) {
        socket.auth.token = newToken;
      }
    }
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
    }
  });

  return socket;
};

/**
 * Disconnect Socket.io connection
 */
export const disconnectSocket = () => {
  if (socket) {
    // Emit logout event before disconnecting
    if (socket.connected) {
      socket.emit('logout');
    }
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
};

/**
 * Get Socket.io instance
 */
export const getSocket = () => {
  if (!socket || !socket.connected) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Send activity update
 */
export const sendActivity = () => {
  const socketInstance = getSocket();
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit('activity');
  }
};

/**
 * Listen for user status updates
 */
export const onUserStatusUpdate = (callback) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.on('user-status-update', callback);
    return () => {
      if (socketInstance) {
        socketInstance.off('user-status-update', callback);
      }
    };
  }
  return () => {};
};

/**
 * Remove all listeners
 */
export const removeAllListeners = () => {
  if (socket) {
    socket.removeAllListeners();
  }
};

