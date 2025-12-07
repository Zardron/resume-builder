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

/**
 * Join a conversation room
 */
export const joinConversation = (conversationId) => {
  const socketInstance = getSocket();
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit('join-conversation', conversationId);
  }
};

/**
 * Leave a conversation room
 */
export const leaveConversation = (conversationId) => {
  const socketInstance = getSocket();
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit('leave-conversation', conversationId);
  }
};

/**
 * Send a message via socket
 */
export const sendMessageViaSocket = (conversationId, messageData) => {
  const socketInstance = getSocket();
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit('send-message', {
      conversationId,
      ...messageData,
    });
  }
};

/**
 * Listen for new messages in a conversation
 */
export const onNewMessage = (callback) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.on('new-message', callback);
    return () => {
      if (socketInstance) {
        socketInstance.off('new-message', callback);
      }
    };
  }
  return () => {};
};

/**
 * Listen for conversation updates
 */
export const onConversationUpdate = (callback) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.on('conversation-updated', callback);
    return () => {
      if (socketInstance) {
        socketInstance.off('conversation-updated', callback);
      }
    };
  }
  return () => {};
};

/**
 * Send typing indicator start
 */
export const sendTypingStart = (conversationId) => {
  const socketInstance = getSocket();
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit('typing-start', { conversationId });
  }
};

/**
 * Send typing indicator stop
 */
export const sendTypingStop = (conversationId) => {
  const socketInstance = getSocket();
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit('typing-stop', { conversationId });
  }
};

/**
 * Listen for typing indicators
 */
export const onUserTyping = (callback) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.on('user-typing', callback);
    return () => {
      if (socketInstance) {
        socketInstance.off('user-typing', callback);
      }
    };
  }
  return () => {};
};

/**
 * Listen for user ban events
 * Sets up listener and ensures it works even if socket connects later
 */
export const onUserBanned = (callback) => {
  const socketInstance = getSocket();
  if (!socketInstance) {
    return () => {};
  }

  // Set up listener immediately
  socketInstance.on('user-banned', callback);

  // Also set up listener when socket connects (in case it's not connected yet)
  const connectHandler = () => {
    socketInstance.on('user-banned', callback);
  };

  if (socketInstance.connected) {
    // Already connected, listener is already set
  } else {
    // Not connected yet, wait for connection
    socketInstance.once('connect', connectHandler);
  }

  // Return cleanup function
  return () => {
    if (socketInstance) {
      socketInstance.off('user-banned', callback);
      socketInstance.off('connect', connectHandler);
    }
  };
};

