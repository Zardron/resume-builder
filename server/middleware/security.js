// Security middleware - provides additional security headers and protections
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (basic - customize based on your needs)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
    );
  }
  
  // Permissions Policy (formerly Feature Policy)
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );
  
  next();
};

// Request ID middleware - adds unique request ID for tracking
export const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || 
           `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Validate request origin (additional CORS check)
export const validateOrigin = (req, res, next) => {
  // This is a secondary check - CORS middleware handles the main validation
  // This can be used for additional logging or blocking
  const origin = req.headers.origin;
  
  if (origin && process.env.NODE_ENV === 'production') {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      // Add other allowed origins
    ].filter(Boolean);
    
    if (!allowedOrigins.includes(origin)) {
      // Log suspicious origin but let CORS middleware handle the response
      // This is just for monitoring
    }
  }
  
  next();
};

