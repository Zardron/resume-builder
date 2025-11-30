// Centralized logging utility
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SecurityLog from '../models/SecurityLog.js';
import AuditLog from '../models/AuditLog.js';
import ClientLog from '../models/ClientLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel = process.env.LOG_LEVEL 
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO
  : process.env.NODE_ENV === 'production' 
    ? LOG_LEVELS.INFO 
    : LOG_LEVELS.DEBUG;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// File-based logging with rotation
const getLogFileName = (level) => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const levelName = level.toLowerCase();
  return path.join(logsDir, `${levelName}-${date}.log`);
};

const writeToFile = (level, message, data = null) => {
  try {
    const logEntry = formatMessage(level, message, data);
    const logFile = getLogFileName(level);
    fs.appendFileSync(logFile, logEntry + '\n', 'utf8');
  } catch (error) {
    // Fallback to console if file write fails
    console.error('Failed to write to log file:', error.message);
  }
};

// Clean old log files (older than 30 days)
const cleanOldLogs = () => {
  try {
    const files = fs.readdirSync(logsDir);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtimeMs < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error('Failed to clean old logs:', error.message);
  }
};

// Run cleanup on startup and then daily
cleanOldLogs();
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000); // Run daily

// Format log message with timestamp and level
const formatMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data }),
  };

  return JSON.stringify(logEntry);
};

// Log error messages
export const logError = (message, error = null, context = {}) => {
  if (currentLogLevel >= LOG_LEVELS.ERROR) {
    const errorData = {
      ...context,
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      }),
    };
    
    const logMessage = formatMessage('ERROR', message, errorData);
    console.error(logMessage);
    writeToFile('ERROR', message, errorData);
    
    // In production, you might want to send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: context });
  }
};

// Log warning messages
export const logWarn = (message, data = {}) => {
  if (currentLogLevel >= LOG_LEVELS.WARN) {
    const logMessage = formatMessage('WARN', message, data);
    console.warn(logMessage);
    writeToFile('WARN', message, data);
  }
};

// Log info messages
export const logInfo = (message, data = {}) => {
  if (currentLogLevel >= LOG_LEVELS.INFO) {
    const logMessage = formatMessage('INFO', message, data);
    console.log(logMessage);
    writeToFile('INFO', message, data);
  }
};

// Log debug messages
export const logDebug = (message, data = {}) => {
  if (currentLogLevel >= LOG_LEVELS.DEBUG) {
    const logMessage = formatMessage('DEBUG', message, data);
    console.log(logMessage);
    writeToFile('DEBUG', message, data);
  }
};

// Log API requests
export const logRequest = (req, res, responseTime = null) => {
  const logData = {
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    ...(responseTime && { responseTime: `${responseTime}ms` }),
    ...(req.user && { userId: req.user._id }),
  };

  if (res.statusCode >= 400) {
    logWarn(`API Request: ${req.method} ${req.path} - ${res.statusCode}`, logData);
  } else {
    logInfo(`API Request: ${req.method} ${req.path} - ${res.statusCode}`, logData);
  }
};

// Log database operations
export const logDatabase = (operation, collection, data = {}) => {
  logDebug(`Database ${operation}: ${collection}`, data);
};

// Log authentication events
export const logAuth = (event, data = {}) => {
  logInfo(`Auth Event: ${event}`, data);
};

// Log security events
export const logSecurity = (event, data = {}) => {
  logWarn(`Security Event: ${event}`, data);
};

// ============================================
// Enhanced Security Logging Functions
// ============================================

/**
 * Parse user agent to extract browser, OS, and device type
 */
const parseUserAgent = (userAgent) => {
  if (!userAgent) {
    return { browser: null, os: null, deviceType: 'unknown' };
  }

  const ua = userAgent.toLowerCase();
  let browser = null;
  let os = null;
  let deviceType = 'unknown';

  // Detect browser
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

  // Detect OS
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  // Detect device type
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    deviceType = 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'tablet';
  } else if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
    deviceType = 'bot';
  } else {
    deviceType = 'desktop';
  }

  return { browser, os, deviceType };
};

/**
 * Get client IP address from request
 */
export const getClientIp = (req) => {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] ||
         'unknown';
};

/**
 * Log security event to database
 */
export const logSecurityEvent = async (eventType, message, data = {}, req = null) => {
  try {
    const ipAddress = req ? getClientIp(req) : data.ipAddress || 'unknown';
    const userAgent = req?.get('user-agent') || data.userAgent || null;
    const parsedUA = parseUserAgent(userAgent);

    const securityLog = new SecurityLog({
      eventType,
      severity: data.severity || 'medium',
      userId: data.userId || req?.user?._id || null,
      userEmail: data.userEmail || req?.user?.email || null,
      ipAddress,
      userAgent,
      deviceType: data.deviceType || parsedUA.deviceType,
      browser: parsedUA.browser,
      os: parsedUA.os,
      country: data.country || null,
      city: data.city || null,
      method: req?.method || data.method || null,
      path: req?.path || req?.originalUrl || data.path || null,
      statusCode: data.statusCode || null,
      message,
      details: data.details || data,
      requestId: req?.requestId || data.requestId || null,
      sessionId: data.sessionId || null,
      responseTime: data.responseTime || null,
    });

    await securityLog.save();
  } catch (error) {
    // Fallback to file logging if database write fails
    logError('Failed to write security log to database', error, { eventType, message, data });
  }
};

/**
 * Log audit event to database
 */
export const logAuditEvent = async (action, resourceType, data = {}, req = null) => {
  try {
    if (!data.userId && !req?.user?._id) {
      // Skip audit logging if no user context
      return;
    }

    const ipAddress = req ? getClientIp(req) : data.ipAddress || 'unknown';
    const userAgent = req?.get('user-agent') || data.userAgent || null;

    const auditLog = new AuditLog({
      action,
      resourceType,
      resourceId: data.resourceId || null,
      userId: data.userId || req.user._id,
      userEmail: data.userEmail || req.user.email,
      userRole: data.userRole || req.user.role || null,
      ipAddress,
      userAgent,
      changes: data.changes || {},
      previousValues: data.previousValues || null,
      newValues: data.newValues || null,
      description: data.description || null,
      requestId: req?.requestId || data.requestId || null,
      path: req?.path || req?.originalUrl || data.path || null,
      method: req?.method || data.method || null,
    });

    await auditLog.save();
  } catch (error) {
    // Fallback to file logging if database write fails
    logError('Failed to write audit log to database', error, { action, resourceType, data });
  }
};

/**
 * Log client-side event to database
 */
export const logClientEvent = async (eventType, message, data = {}) => {
  try {
    const parsedUA = parseUserAgent(data.userAgent);

    const clientLog = new ClientLog({
      userId: data.userId || null,
      sessionId: data.sessionId || null,
      eventType,
      severity: data.severity || 'info',
      userAgent: data.userAgent || 'unknown',
      browser: parsedUA.browser,
      os: parsedUA.os,
      deviceType: data.deviceType || parsedUA.deviceType,
      screenResolution: data.screenResolution || null,
      language: data.language || null,
      ipAddress: data.ipAddress || null,
      referrer: data.referrer || null,
      url: data.url || 'unknown',
      route: data.route || null,
      message,
      details: data.details || {},
      error: data.error || null,
      apiEndpoint: data.apiEndpoint || null,
      apiMethod: data.apiMethod || null,
      apiStatusCode: data.apiStatusCode || null,
      loadTime: data.loadTime || null,
      renderTime: data.renderTime || null,
    });

    await clientLog.save();
  } catch (error) {
    // Fallback to file logging if database write fails
    logError('Failed to write client log to database', error, { eventType, message, data });
  }
};

/**
 * Log database query operation
 */
export const logDatabaseQuery = async (operation, collection, data = {}, req = null) => {
  try {
    // Log slow queries or failed queries as security events
    if (data.slow || data.failed || data.suspicious) {
      await logSecurityEvent(
        'data_access',
        `Database ${operation} on ${collection}`,
        {
          severity: data.failed ? 'high' : data.slow ? 'medium' : 'low',
          details: {
            operation,
            collection,
            queryTime: data.queryTime,
            query: data.sanitizedQuery || 'sanitized',
            error: data.error || null,
          },
          ...(req && { req }),
        },
        req
      );
    }

    // Log to file for debugging
    logDebug(`Database ${operation}: ${collection}`, data);
  } catch (error) {
    logError('Failed to log database query', error, { operation, collection, data });
  }
};

