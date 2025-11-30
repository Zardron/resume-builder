// Rate limiting middleware - prevents abuse by limiting requests per IP
import User from '../models/User.js';
import { logSecurityEvent } from '../utils/logger.js';

const requestCounts = new Map();

// Get window time based on environment
const getWindowMs = (productionWindowMs, developmentWindowMs = 60 * 1000) => {
  return process.env.NODE_ENV === 'production' ? productionWindowMs : developmentWindowMs;
};

// Cleans up old entries from the rate limit store
const cleanupStore = () => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(key);
    }
  }
};

// Clean up every 5 minutes
setInterval(cleanupStore, 5 * 60 * 1000);

// Get client identifier (IP address)
const getClientId = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.headers['x-forwarded-for']?.split(',')[0] || 
         'unknown';
};

// Rate limiter middleware
export const rateLimiter = (options = {}) => {
  const {
    windowMs = getWindowMs(15 * 60 * 1000, 60 * 1000), // 15 minutes production, 1 minute development
    maxRequests = 100, // 100 requests per window default
    message = 'Too many requests, please try again later',
  } = options;

  return (req, res, next) => {
    const clientId = getClientId(req);
    const now = Date.now();
    const key = `${clientId}:${req.path}`;

    // Get or create rate limit data
    let rateLimitData = requestCounts.get(key);

    if (!rateLimitData || now > rateLimitData.resetTime) {
      // Create new rate limit window
      rateLimitData = {
        count: 1,
        resetTime: now + windowMs,
      };
      requestCounts.set(key, rateLimitData);
      return next();
    }

    // Increment request count
    rateLimitData.count++;

    // Check if limit exceeded
    if (rateLimitData.count > maxRequests) {
      const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);
      
      // Log rate limit violation
      logSecurityEvent(
        'rate_limit',
        `Rate limit exceeded: ${rateLimitData.count} requests in window`,
        {
          severity: 'medium',
          statusCode: 429,
          details: {
            path: req.path,
            method: req.method,
            requestCount: rateLimitData.count,
            maxRequests,
            retryAfter,
          },
          userId: req.user?._id || null,
        },
        req
      ).catch(() => {});
      
      return res.status(429).json({
        success: false,
        message,
        retryAfter, // seconds until reset
      });
    }

    next();
  };
};

// Strict rate limiter for authentication endpoints
// Excludes super admins from rate limiting
export const authRateLimiter = async (req, res, next) => {
  // Check if email is provided and if it belongs to a super admin
  if (req.body?.email) {
    try {
      const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
      if (user && user.role === 'super_admin') {
        // Skip rate limiting for super admins
        return next();
      }
    } catch (error) {
      // If there's an error checking user, continue with rate limiting
      // This ensures security - only skip if we can confirm it's a super admin
    }
  }
  
  // Apply rate limiting for non-super-admin users
  const limiter = rateLimiter({
    windowMs: getWindowMs(15 * 60 * 1000, 60 * 1000), // 15 minutes production, 1 minute development
    maxRequests: 5, // 5 login attempts per window
    message: 'Too many authentication attempts, please try again later',
  });
  
  return limiter(req, res, next);
};

// General API rate limiter
export const apiRateLimiter = rateLimiter({
  windowMs: getWindowMs(15 * 60 * 1000, 60 * 1000), // 15 minutes production, 1 minute development
  maxRequests: 100, // 100 requests per window
  message: 'Rate limit exceeded, please try again later',
});

// Strict rate limiter for registration
export const registrationRateLimiter = rateLimiter({
  windowMs: getWindowMs(60 * 60 * 1000, 60 * 1000), // 1 hour production, 1 minute development
  maxRequests: 3, // 3 registrations per window
  message: 'Too many registration attempts, please try again later',
});

// Rate limiter for activity endpoint (allows frequent updates)
export const activityRateLimiter = rateLimiter({
  windowMs: getWindowMs(1 * 60 * 1000, 30 * 1000), // 1 minute production, 30 seconds development
  maxRequests: 10, // 10 activity updates per minute (allows for ~6 seconds between updates)
  message: 'Too many activity updates, please slow down',
});

