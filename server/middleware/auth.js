import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logSecurityEvent } from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token;

    if (!token) {
      // Log unauthorized access attempt
      logSecurityEvent(
        'authorization',
        'Authentication required but no token provided',
        {
          severity: 'medium',
          statusCode: 401,
        },
        req
      ).catch(() => {});
      
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      // Log invalid user token
      logSecurityEvent(
        'authorization',
        'Token provided but user not found',
        {
          severity: 'high',
          userId: decoded.userId,
          statusCode: 401,
        },
        req
      ).catch(() => {});
      
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      // Log banned user access attempt
      logSecurityEvent(
        'authorization',
        'Banned user attempted to access protected resource',
        {
          severity: 'high',
          userId: user._id,
          userEmail: user.email,
          statusCode: 403,
        },
        req
      ).catch(() => {});
      
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been banned. Please contact support if you believe this is an error.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      // Log invalid token
      logSecurityEvent(
        'authorization',
        'Invalid JWT token provided',
        {
          severity: 'medium',
          statusCode: 401,
        },
        req
      ).catch(() => {});
      
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      // Log expired token
      logSecurityEvent(
        'authorization',
        'Expired JWT token provided',
        {
          severity: 'low',
          statusCode: 401,
        },
        req
      ).catch(() => {});
      
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error',
      error: error.message 
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        // Check if user is banned - reject even for optional auth
        if (user.isBanned) {
          return res.status(403).json({ 
            success: false, 
            message: 'Your account has been banned. Please contact support if you believe this is an error.' 
          });
        }
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

export const requireSubscription = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.subscription.status !== 'active') {
    return res.status(403).json({ 
      success: false, 
      message: 'AI subscription required' 
    });
  }

  next();
};

