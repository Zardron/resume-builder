// Input validation middleware - provides validation and sanitization
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true, value: email.toLowerCase().trim() };
};

// Validates password strength (8+ chars, uppercase, lowercase, number, special char)
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'Password must be less than 128 characters' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasUpperCase) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!hasLowerCase) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!hasNumber) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  
  if (!hasSpecialChar) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }
  
  return { valid: true, value: password };
};

// Validates MongoDB ObjectId format
export const validateObjectId = (id) => {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'ID is required' };
  }
  
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    return { valid: false, error: 'Invalid ID format' };
  }
  
  return { valid: true, value: id };
};

// Sanitizes string input to prevent XSS
export const sanitizeString = (input, maxLength = 1000) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  let sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, maxLength);
  
  return sanitized;
};

// Validates and sanitizes text input
export const validateText = (text, options = {}) => {
  const { required = false, minLength = 0, maxLength = 10000 } = options;
  
  if (!text && required) {
    return { valid: false, error: 'This field is required' };
  }
  
  if (!text) {
    return { valid: true, value: '' };
  }
  
  if (typeof text !== 'string') {
    return { valid: false, error: 'Invalid input type' };
  }
  
  const sanitized = sanitizeString(text, maxLength);
  
  if (sanitized.length < minLength) {
    return { valid: false, error: `Text must be at least ${minLength} characters long` };
  }
  
  return { valid: true, value: sanitized };
};

// Validates URL format
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }
  
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use http or https protocol' };
    }
    return { valid: true, value: url.trim() };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
};

// Validates phone number (basic validation)
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }
  
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Check if it contains only digits (and optional + at start)
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  
  return { valid: true, value: phone.trim() };
};

// Middleware to validate request body fields
export const validateFields = (validations) => {
  return (req, res, next) => {
    const errors = {};
    
    for (const [field, validator] of Object.entries(validations)) {
      const value = req.body[field];
      const result = validator(value);
      
      if (!result.valid) {
        errors[field] = result.error;
      } else if (result.value !== undefined) {
        req.body[field] = result.value;
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    
    next();
  };
};

