// Centralized error messages for consistent user-facing error handling
export const getErrorMessage = (error) => {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Network errors
  if (error.isNetworkError || error.message?.includes('Network')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // HTTP status code based messages
  if (error.status) {
    switch (error.status) {
      case 400:
        return error.message || 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return error.message || 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return error.message || 'This resource already exists.';
      case 422:
        return error.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
      case 502:
      case 503:
        return 'The server is experiencing issues. Please try again later.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }

  // Specific error messages
  if (error.message) {
    // Authentication errors
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return 'Your session has expired. Please log in again.';
    }

    // Validation errors
    if (error.message.includes('validation') || error.message.includes('required')) {
      return error.message;
    }

    // Email verification
    if (error.message.includes('verify') || error.message.includes('verification')) {
      return 'Please verify your email address to continue.';
    }

    // Password errors
    if (error.message.includes('password')) {
      return error.message;
    }

    // Generic fallback
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

// Get error title based on error type
export const getErrorTitle = (error) => {
  if (!error) {
    return 'Error';
  }

  if (error.status) {
    switch (error.status) {
      case 400:
        return 'Invalid Request';
      case 401:
        return 'Authentication Required';
      case 403:
        return 'Access Denied';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Validation Error';
      case 429:
        return 'Too Many Requests';
      case 500:
      case 502:
      case 503:
        return 'Server Error';
      default:
        return 'Error';
    }
  }

  if (error.isNetworkError) {
    return 'Connection Error';
  }

  return 'Error';
};

// Check if error is retryable
export const isRetryableError = (error) => {
  if (!error) {
    return false;
  }

  // Network errors are retryable
  if (error.isNetworkError) {
    return true;
  }

  // 5xx errors are retryable
  if (error.status >= 500 && error.status < 600) {
    return true;
  }

  // 429 (rate limit) is retryable
  if (error.status === 429) {
    return true;
  }

  return false;
};

// Get retry delay in milliseconds
export const getRetryDelay = (error, attempt = 1) => {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  const baseDelay = 1000;
  const maxDelay = 30000;
  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
  
  // If rate limited, use retry-after header if available
  if (error.status === 429 && error.response?.retryAfter) {
    return error.response.retryAfter * 1000;
  }
  
  return delay;
};

