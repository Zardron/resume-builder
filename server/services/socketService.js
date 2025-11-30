import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logInfo, logError } from '../utils/logger.js';

let io = null;

// Map to store user socket connections (userId -> socketId)
const userSockets = new Map();

/**
 * Initialize Socket.io server
 */
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      logError('Socket authentication error', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    const user = socket.user;

    logInfo('User connected via socket', { userId, email: user.email });

    // Store socket connection
    userSockets.set(userId, socket.id);

    // Update user's lastActivity
    try {
      user.lastActivity = new Date();
      await user.save();
    } catch (error) {
      logError('Failed to update user activity on connect', error);
    }

    // Emit user online status to all admins
    emitUserStatusUpdate(userId, 'online');

    // Handle activity updates
    socket.on('activity', async () => {
      try {
        user.lastActivity = new Date();
        await user.save();
      } catch (error) {
        logError('Failed to update user activity', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async (reason) => {
      logInfo('User disconnected via socket', { userId, email: user.email, reason });
      
      // Remove socket connection
      const wasConnected = userSockets.has(userId);
      userSockets.delete(userId);

      // If user was connected, immediately emit offline status
      // (they can reconnect if it was accidental)
      if (wasConnected) {
        emitUserStatusUpdate(userId, 'offline');
      }
    });

    // Handle explicit logout event
    socket.on('logout', async () => {
      logInfo('User logged out via socket', { userId, email: user.email });
      
      // Remove socket connection
      userSockets.delete(userId);
      
      // Immediately mark as offline
      emitUserStatusUpdate(userId, 'offline');
      
      // Disconnect the socket
      socket.disconnect();
    });
  });

  logInfo('Socket.io server initialized');
  return io;
};

/**
 * Get Socket.io instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return io;
};

/**
 * Emit user status update to all connected admins
 */
export const emitUserStatusUpdate = (userId, status) => {
  if (!io) return;

  // Convert userId to string for consistency
  const userIdStr = userId.toString();

  // Emit to all connected clients (they can filter on frontend)
  io.emit('user-status-update', {
    userId: userIdStr,
    status,
    timestamp: new Date(),
  });

  logInfo('User status update emitted', { userId: userIdStr, status });
};

/**
 * Get online users count
 */
export const getOnlineUsersCount = () => {
  return userSockets.size;
};

/**
 * Check if user is connected
 */
export const isUserConnected = (userId) => {
  return userSockets.has(userId);
};

