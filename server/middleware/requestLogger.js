import { logSecurityEvent, getClientIp, logError } from '../utils/logger.js';

/**
 * Middleware to log all API requests with security context
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  // Override res.send to capture response time and status
  res.send = function (body) {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log request asynchronously (don't block response)
    setImmediate(async () => {
      try {
        // Determine event type based on status code and path
        let eventType = 'data_access';
        let severity = 'low';

        // Classify request
        if (statusCode >= 500) {
          eventType = 'system_error';
          severity = 'high';
        } else if (statusCode === 401 || statusCode === 403) {
          eventType = 'authorization';
          severity = statusCode === 403 ? 'high' : 'medium';
        } else if (statusCode === 429) {
          eventType = 'rate_limit';
          severity = 'medium';
        } else if (statusCode >= 400) {
          eventType = 'security_violation';
          severity = 'medium';
        } else if (req.path.includes('/auth/')) {
          eventType = 'authentication';
          severity = 'low';
        } else if (req.path.includes('/admin/')) {
          eventType = 'data_access';
          severity = 'high';
        } else if (req.method !== 'GET') {
          eventType = 'data_modification';
          severity = 'medium';
        }

        // Log sensitive endpoints with higher severity
        const sensitivePaths = [
          '/api/admin',
          '/api/payments',
          '/api/billing',
          '/api/auth/password',
          '/api/auth/email',
        ];

        if (sensitivePaths.some(path => req.path.startsWith(path))) {
          severity = 'high';
        }

        await logSecurityEvent(
          eventType,
          `${req.method} ${req.path} - ${statusCode}`,
          {
            severity,
            statusCode,
            responseTime,
            userId: req.user?._id || null,
            userEmail: req.user?.email || null,
            method: req.method,
            path: req.path,
            requestId: req.requestId || null,
          },
          req
        );
      } catch (error) {
        // Silently fail - don't break the request
        logError('Request logging error', error);
      }
    });

    return originalSend.call(this, body);
  };

  next();
};

/**
 * Middleware to detect suspicious patterns
 */
export const suspiciousActivityDetector = (req, res, next) => {
  const ipAddress = getClientIp(req);
  const userAgent = req.get('user-agent') || '';

  // Check for suspicious patterns
  const suspiciousPatterns = [
    { pattern: /(<script|javascript:|onerror=|onload=)/i, type: 'xss_attempt' },
    { pattern: /(union.*select|drop.*table|insert.*into|delete.*from)/i, type: 'sql_injection_attempt' },
    { pattern: /(\.\.\/|\.\.\\|etc\/passwd|boot\.ini)/i, type: 'path_traversal_attempt' },
  ];

  // Check query parameters and body
  const checkData = (data) => {
    if (!data || typeof data !== 'object') return;
    
    const dataString = JSON.stringify(data).toLowerCase();
    
    for (const { pattern, type } of suspiciousPatterns) {
      if (pattern.test(dataString)) {
        // Log as security event
        logSecurityEvent(
          type,
          `Suspicious activity detected: ${type}`,
          {
            severity: 'high',
            details: {
              pattern: type,
              path: req.path,
              method: req.method,
              sanitizedData: 'sanitized',
            },
            userId: req.user?._id || null,
          },
          req
        ).catch(() => {}); // Don't block request
        break;
      }
    }
  };

  // Check query parameters
  if (Object.keys(req.query).length > 0) {
    checkData(req.query);
  }

  // Check body (for POST/PUT/PATCH)
  if (req.body && Object.keys(req.body).length > 0) {
    checkData(req.body);
  }

  // Check for bot-like behavior
  if (!userAgent || userAgent.length < 10) {
    logSecurityEvent(
      'bot_detection',
      'Suspicious user agent detected',
      {
        severity: 'medium',
        details: {
          userAgent: userAgent || 'missing',
          path: req.path,
        },
      },
      req
    ).catch(() => {});
  }

  next();
};

