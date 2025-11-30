/**
 * Frontend Security Logging Service
 * Logs client-side events for security monitoring
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Parse user agent to extract browser and OS info
const parseUserAgent = () => {
  const ua = navigator.userAgent.toLowerCase();
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
  } else {
    deviceType = 'desktop';
  }

  return { browser, os, deviceType };
};

// Get screen resolution
const getScreenResolution = () => {
  return `${window.screen.width}x${window.screen.height}`;
};

// Get session ID (create if doesn't exist)
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Track rapid clicks to detect bot behavior
let clickTimestamps = [];
let lastClickTime = 0;
const CLICK_THRESHOLD = 10; // clicks
const CLICK_WINDOW = 1000; // milliseconds

const detectBotBehavior = () => {
  const now = Date.now();
  clickTimestamps = clickTimestamps.filter(timestamp => now - timestamp < CLICK_WINDOW);
  clickTimestamps.push(now);

  if (clickTimestamps.length > CLICK_THRESHOLD) {
    logClientEvent('bot_behavior', 'Rapid clicking detected', {
      severity: 'warning',
      details: {
        clicksInWindow: clickTimestamps.length,
        windowMs: CLICK_WINDOW,
      },
    });
    return true;
  }
  return false;
};

// Detect DevTools opening (basic detection)
let devToolsOpen = false;
const detectDevTools = () => {
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;

  if ((widthThreshold || heightThreshold) && !devToolsOpen) {
    devToolsOpen = true;
    logClientEvent('devtools_detection', 'Developer tools detected', {
      severity: 'info',
    });
  } else if (!widthThreshold && !heightThreshold && devToolsOpen) {
    devToolsOpen = false;
  }
};

// Monitor DevTools periodically
setInterval(detectDevTools, 1000);

/**
 * Log client-side event
 */
export const logClientEvent = async (eventType, message, data = {}) => {
  try {
    const uaInfo = parseUserAgent();
    const userId = data.userId || (window.__USER__?.id || null);
    
    const logData = {
      eventType,
      message,
      userId,
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      browser: uaInfo.browser,
      os: uaInfo.os,
      deviceType: uaInfo.deviceType,
      screenResolution: getScreenResolution(),
      language: navigator.language,
      url: window.location.href,
      route: window.location.pathname,
      referrer: document.referrer || null,
      ...data,
    };

    // Send to backend (fire and forget - don't block UI)
    fetch(`${API_BASE_URL}/api/logs/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      },
      body: JSON.stringify(logData),
    }).catch(() => {
      // Silently fail - don't break the app
    });
  } catch (error) {
    // Silently fail - don't break the app
    console.error('Client logging error:', error);
  }
};

/**
 * Log page view / route change
 */
export const logPageView = (route) => {
  logClientEvent('page_view', `Page viewed: ${route}`, {
    route,
    url: window.location.href,
  });
};

/**
 * Log route change
 */
export const logRouteChange = (from, to) => {
  logClientEvent('route_change', `Route changed from ${from} to ${to}`, {
    from,
    to,
    url: window.location.href,
  });
};

/**
 * Log API request
 */
export const logAPIRequest = async (endpoint, method, statusCode, error = null) => {
  return logClientEvent(
    error ? 'api_error' : 'api_request',
    error ? `API error: ${endpoint}` : `API request: ${method} ${endpoint}`,
    {
      apiEndpoint: endpoint,
      apiMethod: method,
      apiStatusCode: statusCode,
      error: error ? {
        name: error.name,
        message: error.message,
        code: error.code,
      } : null,
    }
  );
};

/**
 * Log form submission
 */
export const logFormSubmit = (formName, success = true) => {
  logClientEvent('form_submit', `Form submitted: ${formName}`, {
    formName,
    success,
  });
};

/**
 * Log suspicious UI action
 */
export const logSuspiciousAction = (action, details = {}) => {
  logClientEvent('suspicious_activity', `Suspicious action: ${action}`, {
    severity: 'warning',
    details,
  });
};

/**
 * Log error
 */
export const logError = (error, context = {}) => {
  logClientEvent('error', error.message || 'Client error', {
    severity: 'error',
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  });
};

/**
 * Log click event (with bot detection)
 */
export const logClick = (element, details = {}) => {
  if (detectBotBehavior()) {
    return; // Already logged as bot behavior
  }

  logClientEvent('click', `Click on ${element}`, {
    element,
    ...details,
  });
};

/**
 * Log performance metrics
 */
export const logPerformance = (metricName, value, unit = 'ms') => {
  logClientEvent('performance', `Performance: ${metricName}`, {
    metricName,
    value,
    unit,
    loadTime: value,
  });
};

/**
 * Track rate limit from frontend
 */
export const logRateLimit = async (endpoint, retryAfter) => {
  return logClientEvent('rate_limit', `Rate limit hit: ${endpoint}`, {
    severity: 'warning',
    apiEndpoint: endpoint,
    retryAfter,
  });
};

// Track page load time
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    logPerformance('page_load', loadTime);
  });
}

// Track route changes (for React Router)
let lastRoute = window.location.pathname;
export const trackRouteChange = () => {
  const currentRoute = window.location.pathname;
  if (currentRoute !== lastRoute) {
    logRouteChange(lastRoute, currentRoute);
    lastRoute = currentRoute;
  }
};

// Export default
export default {
  logClientEvent,
  logPageView,
  logRouteChange,
  logAPIRequest,
  logFormSubmit,
  logSuspiciousAction,
  logError,
  logClick,
  logPerformance,
  logRateLimit,
  trackRouteChange,
};

