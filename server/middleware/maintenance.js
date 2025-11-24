import SystemConfig from '../models/SystemConfig.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to check maintenance mode
 * Super admins can bypass maintenance mode
 * Public endpoints like /api/auth/public-config and /api/auth/login are always allowed
 * 
 * Note: This middleware runs before authentication, so we need to check for super admin
 * by verifying the token if present
 */
export const checkMaintenanceMode = async (req, res, next) => {
  try {
    const path = req.path || req.url;
    
    // Always allow public config endpoint (needed for frontend to check maintenance status)
    if (path.includes('/public-config')) {
      return next();
    }

    // Always allow login endpoint (we'll check maintenance mode after authentication in the route)
    if (path.includes('/login') && path.includes('/auth')) {
      return next();
    }

    // Get system configuration
    const config = await SystemConfig.getConfig();
    
    // If maintenance mode is not enabled, continue
    if (!config.general.maintenanceMode) {
      return next();
    }

    // Check if user is authenticated (via token) and is super admin
    // This allows super admins to bypass maintenance mode even before authentication middleware runs
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('role');
        if (user && user.role === 'super_admin') {
          return next();
        }
      }
    } catch (error) {
      // If token verification fails, continue to block the request
      // This is expected for non-authenticated users
    }

    // Also check if req.user is set (in case this middleware runs after authentication)
    if (req.user && req.user.role === 'super_admin') {
      return next();
    }

    // Block all other requests during maintenance
    return res.status(503).json({
      success: false,
      message: 'Service is currently under maintenance. Please try again later.',
      maintenanceMode: true,
    });
  } catch (error) {
    console.error('Maintenance mode check error:', error);
    // On error, allow request to continue (fail open)
    // This prevents maintenance mode from breaking the system if there's a config error
    return next();
  }
};

