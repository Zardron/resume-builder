import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { logInfo, logError } from '../utils/logger.js';

let io = null;

// Map to store user socket connections (userId -> socketId)
const userSockets = new Map();
// Map to store user's joined conversations (socketId -> Set of conversationIds)
const socketConversations = new Map();

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

    // Handle explicit logout event
    socket.on('logout', async () => {
      logInfo('User logged out via socket', { userId, email: user.email });
      
      // Remove socket connection
      userSockets.delete(userId);
      socketConversations.delete(socket.id);
      
      // Immediately mark as offline
      emitUserStatusUpdate(userId, 'offline');
      
      // Disconnect the socket
      socket.disconnect();
    });

    // Handle joining a conversation room
    socket.on('join-conversation', async (conversationId) => {
      try {
        // Verify user is a participant in this conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        const isParticipant = conversation.participants.some(
          p => p.userId.toString() === userId
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Join the conversation room
        socket.join(`conversation:${conversationId}`);
        
        // Track this conversation for this socket
        if (!socketConversations.has(socket.id)) {
          socketConversations.set(socket.id, new Set());
        }
        socketConversations.get(socket.id).add(conversationId);

        logInfo('User joined conversation', { userId, conversationId, socketId: socket.id });
      } catch (error) {
        logError('Error joining conversation', error, { userId, conversationId });
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Handle leaving a conversation room
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      
      if (socketConversations.has(socket.id)) {
        socketConversations.get(socket.id).delete(conversationId);
        if (socketConversations.get(socket.id).size === 0) {
          socketConversations.delete(socket.id);
        }
      }

      logInfo('User left conversation', { userId, conversationId, socketId: socket.id });
    });

    // Handle sending a message via socket (alternative to REST API)
    socket.on('send-message', async (data) => {
      try {
        const { conversationId, body, subject, attachments } = data;

        // Verify user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        const userParticipant = conversation.participants.find(
          p => p.userId.toString() === userId
        );

        if (!userParticipant) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Find recipient
        const recipient = conversation.participants.find(
          p => p.userId.toString() !== userId
        );

        if (!recipient) {
          socket.emit('error', { message: 'Recipient not found' });
          return;
        }

        // Create message
        const message = new Message({
          conversationId,
          senderId: user._id,
          senderRole: userParticipant.role,
          recipientId: recipient.userId,
          recipientRole: recipient.role,
          subject,
          body,
          attachments: attachments || [],
        });

        await message.save();

        // Populate sender info for response
        await message.populate('senderId', 'fullName email profile.avatar');

        // Update conversation
        conversation.lastMessageAt = new Date();
        const currentUnread = conversation.unreadCount.get(recipient.userId.toString()) || 0;
        conversation.unreadCount.set(recipient.userId.toString(), currentUnread + 1);
        await conversation.save();

        // Emit new message to all participants in the conversation room
        io.to(`conversation:${conversationId}`).emit('new-message', {
          conversationId,
          message: message.toObject(),
        });

        // Also emit conversation update to participants
        io.to(`conversation:${conversationId}`).emit('conversation-updated', {
          conversationId,
          lastMessageAt: conversation.lastMessageAt,
          unreadCount: Object.fromEntries(conversation.unreadCount),
        });

        logInfo('Message sent via socket', { userId, conversationId, messageId: message._id });
      } catch (error) {
        logError('Error sending message via socket', error, { userId });
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing-start', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        conversationId,
        userId,
        userName: user.fullName || user.email,
        isTyping: true,
      });
    });

    socket.on('typing-stop', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        conversationId,
        userId,
        userName: user.fullName || user.email,
        isTyping: false,
      });
    });

    // Clean up conversations on disconnect
    socket.on('disconnect', async (reason) => {
      logInfo('User disconnected via socket', { userId, email: user.email, reason });
      
      // Leave all conversation rooms
      if (socketConversations.has(socket.id)) {
        const conversations = socketConversations.get(socket.id);
        conversations.forEach(conversationId => {
          socket.leave(`conversation:${conversationId}`);
        });
        socketConversations.delete(socket.id);
      }
      
      // Remove socket connection
      const wasConnected = userSockets.has(userId);
      userSockets.delete(userId);

      // If user was connected, immediately emit offline status
      // (they can reconnect if it was accidental)
      if (wasConnected) {
        emitUserStatusUpdate(userId, 'offline');
      }
    });
  });

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

/**
 * Emit new message to conversation participants
 */
export const emitNewMessage = (conversationId, message) => {
  if (!io) return;
  
  io.to(`conversation:${conversationId}`).emit('new-message', {
    conversationId,
    message,
  });
};

/**
 * Emit conversation update to participants
 */
export const emitConversationUpdate = (conversationId, updateData) => {
  if (!io) return;
  
  io.to(`conversation:${conversationId}`).emit('conversation-updated', {
    conversationId,
    ...updateData,
  });
};

/**
 * Get socket ID for a user
 */
export const getUserSocketId = (userId) => {
  return userSockets.get(userId.toString());
};

/**
 * Emit ban event to a specific user
 */
export const emitUserBanned = (userId) => {
  if (!io) {
    logInfo('Socket.io not initialized, cannot emit ban event', { userId: userId.toString() });
    return;
  }
  
  const userIdStr = userId.toString();
  const socketId = userSockets.get(userIdStr);
  
  if (socketId) {
    // Emit to the specific socket
    io.to(socketId).emit('user-banned', {
      message: 'Your account has been banned. You have been logged out.',
      timestamp: new Date(),
    });
    
    // Also try to find the socket and disconnect it directly
    io.sockets.sockets.forEach((socket) => {
      if (socket.userId === userIdStr) {
        // Force disconnect after a short delay to allow message to be received
        setTimeout(() => {
          socket.disconnect(true);
        }, 100);
      }
    });
    
    logInfo('User ban event emitted and socket scheduled for disconnect', { userId: userIdStr, socketId });
  } else {
    logInfo('User ban event not emitted - user not connected via socket', { userId: userIdStr });
  }
};

