const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to set auth token
const setToken = (token, remember = false) => {
  if (remember) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
};

// Helper function to remove auth token
const removeToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// Base fetch function with error handling
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const method = options.method || 'GET';
  const startTime = Date.now();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle cases where response might not be JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If response is not JSON, create a basic error structure
      const text = await response.text();
      data = { message: text || 'Request failed', success: false };
    }

    if (!response.ok) {
      // Only remove token for specific authentication errors, not all 401s
      // This prevents logout on transient errors or network issues
      if (response.status === 401) {
        // Check if this is an actual auth failure (not a network/parsing error)
        const isAuthError = data.message && (
          data.message.includes('Authentication required') ||
          data.message.includes('Invalid token') ||
          data.message.includes('Token expired') ||
          data.message.includes('User not found')
        );
        
        if (isAuthError) {
          // Only remove token and redirect for actual auth failures
          removeToken();
          // Don't redirect if we're already on the login page or during initialization
          const isAuthEndpoint = endpoint.includes('/auth/');
          if (!isAuthEndpoint && window.location.pathname !== '/sign-in') {
            window.location.href = '/sign-in';
          }
        }
      }
      // Handle 403 (forbidden) - check for ban or email verification
      const isBanError = response.status === 403 && data.message && (
        data.message.toLowerCase().includes('banned') || 
        data.message.toLowerCase().includes('ban')
      );
      
      const isVerificationError = 
        data.requiresVerification === true ||
        (response.status === 403 && !isBanError && data.message && (
          data.message.toLowerCase().includes('verify') || 
          data.message.toLowerCase().includes('verification')
        ));
      
      // Handle ban error - logout user and redirect
      if (isBanError) {
        removeToken();
        const error = new Error(data.message || 'Your account has been banned');
        error.status = response.status;
        error.isBanned = true;
        error.response = data;
        // Redirect to login page with ban message
        if (window.location.pathname !== '/sign-in') {
          // Clear sessionStorage flag so Login page can show notification after redirect
          sessionStorage.removeItem('ban_notification_shown');
          window.location.href = '/sign-in?banned=true';
        }
        throw error;
      }
      
      if (isVerificationError) {
        const error = new Error(data.message || 'Email verification required');
        error.requiresVerification = true;
        error.status = response.status;
        error.email = data.data?.user?.email;
        error.response = data;
        throw error;
      }
      
      // Attach status code to error for better handling
      const error = new Error(data.message || 'Request failed');
      error.status = response.status;
      error.response = data;
      // Preserve requiresVerification if it exists in response
      if (data.requiresVerification !== undefined) {
        error.requiresVerification = data.requiresVerification;
      }
      throw error;
    }

    // Log successful API request (fire and forget)
    const { logAPIRequest } = await import('./loggingService');
    logAPIRequest(endpoint, method, response.status).catch(() => {
      // Silently fail if logging service is not available
    });

    return data;
  } catch (error) {
    // Log failed API request (fire and forget)
    const { logAPIRequest } = await import('./loggingService');
    logAPIRequest(endpoint, method, error.status || 0, error).catch(() => {
      // Silently fail if logging service is not available
    });

    // Handle rate limit errors
    if (error.status === 429) {
      const { logRateLimit } = await import('./loggingService');
      logRateLimit(endpoint, error.response?.retryAfter).catch(() => {});
    }
    // Handle network errors and other fetch failures
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Network error - don't remove token, just throw the error
      const networkError = new Error('Network error. Please check your connection.');
      networkError.isNetworkError = true;
      throw networkError;
    }
    
    // Preserve existing error properties
    if (!error.status) {
      error.status = 0; // Network error
    }
    
    // Log error for debugging (only in development)
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (fullName, email, password, userType = 'applicant', organization) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, userType, organization }),
    });
    
    if (response.data?.token) {
      setToken(response.data.token, true);
    }
    
    return response;
  },

  login: async (email, password, remember = false) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Token will be set by the authSlice after successful login
    // This keeps token management centralized in the Redux slice
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
    }
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  updateProfile: async (updates) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  verifyEmail: async (code) => {
    return await apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  verifyEmailUnauthenticated: async (code, email) => {
    // This endpoint doesn't require authentication
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/verify-email-unauthenticated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify email');
    }
    return data;
  },

  resendVerification: async () => {
    return await apiRequest('/auth/resend-verification', {
      method: 'POST',
    });
  },

  resendVerificationUnauthenticated: async (email) => {
    // This endpoint doesn't require authentication
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/resend-verification-unauthenticated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  },

  getPublicConfig: async () => {
    // This endpoint doesn't require authentication
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/public-config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  },

  updateActivity: async () => {
    return await apiRequest('/auth/activity', {
      method: 'POST',
    });
  },
};

// Resume API
export const resumeAPI = {
  getAll: async () => {
    const response = await apiRequest('/resumes');
    return response.data?.resumes || [];
  },

  getById: async (id) => {
    const response = await apiRequest(`/resumes/${id}`);
    return response.data?.resume;
  },

  create: async (resumeData) => {
    const response = await apiRequest('/resumes', {
      method: 'POST',
      body: JSON.stringify(resumeData),
    });
    return response.data?.resume;
  },

  update: async (id, updates) => {
    const response = await apiRequest(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data?.resume;
  },

  delete: async (id) => {
    return await apiRequest(`/resumes/${id}`, {
      method: 'DELETE',
    });
  },

  duplicate: async (id) => {
    const response = await apiRequest(`/resumes/${id}/duplicate`, {
      method: 'POST',
    });
    return response.data?.resume;
  },
};

// Credits API
export const creditsAPI = {
  getBalance: async () => {
    const response = await apiRequest('/credits/balance');
    return response.data?.credits || 0;
  },

  getTransactions: async () => {
    const response = await apiRequest('/credits/transactions');
    return response.data?.transactions || [];
  },
};

// Subscription API
export const subscriptionAPI = {
  getStatus: async () => {
    const response = await apiRequest('/subscriptions/status');
    return response.data;
  },

  subscribe: async (paymentMethod, subscriptionDuration = 1, planId = 'enterprise') => {
    const response = await apiRequest('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ paymentMethod, subscriptionDuration, planId }),
    });
    return response.data;
  },

  cancel: async () => {
    return await apiRequest('/subscriptions/cancel', {
      method: 'POST',
    });
  },

  reactivate: async () => {
    return await apiRequest('/subscriptions/reactivate', {
      method: 'POST',
    });
  },

  upgrade: async (planId, paymentMethod) => {
    const response = await apiRequest('/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethod }),
    });
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  getHistory: async () => {
    const response = await apiRequest('/payments/history');
    return response.data?.payments || [];
  },

  purchaseCredits: async (packageId, paymentMethod) => {
    const response = await apiRequest('/payments/credits', {
      method: 'POST',
      body: JSON.stringify({ packageId, paymentMethod }),
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiRequest(`/payments/${id}`);
    return response.data?.payment;
  },
};

// Download API
export const downloadAPI = {
  downloadResume: async (id, format = 'pdf') => {
    const response = await apiRequest(`/downloads/${id}`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });
    return response.data;
  },
};

// Organization API
export const organizationAPI = {
  create: async (organizationData) => {
    const response = await apiRequest('/organizations', {
      method: 'POST',
      body: JSON.stringify(organizationData),
    });
    return response.data;
  },

  getById: async (orgId) => {
    const response = await apiRequest(`/organizations/${orgId}`);
    return response.data;
  },

  update: async (orgId, updates) => {
    const response = await apiRequest(`/organizations/${orgId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  getTeamMembers: async (orgId) => {
    const response = await apiRequest(`/organizations/${orgId}/team`);
    return response.data;
  },

  inviteTeamMember: async (orgId, memberData) => {
    const response = await apiRequest(`/organizations/${orgId}/team/invite`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
    return response.data;
  },

  updateTeamMemberRole: async (orgId, memberId, role) => {
    const response = await apiRequest(`/organizations/${orgId}/team/${memberId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    return response.data;
  },

  removeTeamMember: async (orgId, memberId) => {
    return await apiRequest(`/organizations/${orgId}/team/${memberId}`, {
      method: 'DELETE',
    });
  },

  getTeamActivity: async (orgId) => {
    const response = await apiRequest(`/organizations/${orgId}/team/activity`);
    return response.data;
  },
};

// Jobs API
export const jobsAPI = {
  getAll: async () => {
    const response = await apiRequest('/jobs');
    return response.data?.jobs || [];
  },

  getById: async (id) => {
    const response = await apiRequest(`/jobs/${id}`);
    return response.data?.job;
  },

  create: async (jobData) => {
    const response = await apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return response.data?.job;
  },

  update: async (id, updates) => {
    const response = await apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data?.job;
  },

  delete: async (id) => {
    return await apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  duplicate: async (id) => {
    const response = await apiRequest(`/jobs/${id}/duplicate`, {
      method: 'POST',
    });
    return response.data?.job;
  },

  getAnalytics: async (id) => {
    const response = await apiRequest(`/jobs/${id}/analytics`);
    return response.data;
  },

  publish: async (id) => {
    const response = await apiRequest(`/jobs/${id}/publish`, {
      method: 'POST',
    });
    return response.data;
  },

  pause: async (id) => {
    const response = await apiRequest(`/jobs/${id}/pause`, {
      method: 'POST',
    });
    return response.data;
  },
};

// Applications API
export const applicationsAPI = {
  getAll: async () => {
    const response = await apiRequest('/applications');
    // Controller returns { success: true, data: applications[] }
    return Array.isArray(response.data) ? response.data : (response.data?.applications || []);
  },

  getById: async (id) => {
    const response = await apiRequest(`/applications/${id}`);
    return response.data?.application;
  },

  create: async (applicationData) => {
    const response = await apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
    return response.data?.application;
  },

  updateStatus: async (id, status) => {
    const response = await apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data?.application;
  },

  addNote: async (id, note) => {
    const response = await apiRequest(`/applications/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return response.data;
  },

  addTags: async (id, tags) => {
    const response = await apiRequest(`/applications/${id}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tags }),
    });
    return response.data;
  },

  rateApplication: async (id, rating) => {
    const response = await apiRequest(`/applications/${id}/rating`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
    return response.data;
  },

  withdraw: async (id) => {
    const response = await apiRequest(`/applications/${id}/withdraw`, {
      method: 'POST',
    });
    return response.data;
  },

  getAIMatch: async (id) => {
    const response = await apiRequest(`/applications/${id}/ai-match`);
    return response.data;
  },

  bulkAction: async (action, applicationIds, data = {}) => {
    const response = await apiRequest('/applications/bulk-action', {
      method: 'POST',
      body: JSON.stringify({ action, applicationIds, ...data }),
    });
    return response.data;
  },
};

// Interviews API
export const interviewsAPI = {
  getAll: async () => {
    const response = await apiRequest('/interviews');
    return response.data?.interviews || [];
  },

  getById: async (id) => {
    const response = await apiRequest(`/interviews/${id}`);
    return response.data?.interview;
  },

  create: async (interviewData) => {
    const response = await apiRequest('/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    });
    return response.data?.interview;
  },

  update: async (id, updates) => {
    const response = await apiRequest(`/interviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data?.interview;
  },

  delete: async (id) => {
    return await apiRequest(`/interviews/${id}`, {
      method: 'DELETE',
    });
  },

  confirm: async (id) => {
    const response = await apiRequest(`/interviews/${id}/confirm`, {
      method: 'POST',
    });
    return response.data;
  },

  reschedule: async (id, newDate) => {
    const response = await apiRequest(`/interviews/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ newDate }),
    });
    return response.data;
  },

  cancel: async (id) => {
    const response = await apiRequest(`/interviews/${id}/cancel`, {
      method: 'POST',
    });
    return response.data;
  },

  submitFeedback: async (id, feedback) => {
    const response = await apiRequest(`/interviews/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
    return response.data;
  },

  getCalendar: async (userId) => {
    const response = await apiRequest(`/interviews/calendar/${userId}`);
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  getConversations: async () => {
    const response = await apiRequest('/messages/conversations');
    return response.data || [];
  },

  createConversation: async (conversationData) => {
    const response = await apiRequest('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
    return response.data;
  },

  getConversationById: async (id) => {
    const response = await apiRequest(`/messages/conversations/${id}`);
    return response.data;
  },

  getOrCreateConversation: async (applicationId) => {
    const response = await apiRequest(`/messages/conversations/application/${applicationId}`);
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await apiRequest(`/messages/conversations/${conversationId}/messages`);
    return response.data || [];
  },

  sendMessage: async (conversationId, messageData) => {
    const response = await apiRequest(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    return response.data;
  },

  markAsRead: async (messageId) => {
    const response = await apiRequest(`/messages/messages/${messageId}/read`, {
      method: 'PUT',
    });
    return response.data;
  },

  getTemplates: async () => {
    const response = await apiRequest('/messages/templates');
    return response.data?.templates || [];
  },

  sendTemplate: async (templateData) => {
    const response = await apiRequest('/messages/send-template', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async () => {
    const response = await apiRequest('/analytics/overview');
    return response.data;
  },

  getHiringFunnel: async () => {
    const response = await apiRequest('/analytics/hiring-funnel');
    return response.data;
  },

  getTimeToHire: async () => {
    const response = await apiRequest('/analytics/time-to-hire');
    return response.data;
  },

  getSourceAnalytics: async () => {
    const response = await apiRequest('/analytics/source-analytics');
    return response.data;
  },

  getTeamPerformance: async () => {
    const response = await apiRequest('/analytics/team-performance');
    return response.data;
  },

  getJobPerformance: async () => {
    const response = await apiRequest('/analytics/job-performance');
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  // Recruiter dashboard
  getRecruiterStats: async () => {
    const response = await apiRequest('/dashboard/recruiter/stats');
    return response.data;
  },

  getRecruiterPipeline: async () => {
    const response = await apiRequest('/dashboard/recruiter/pipeline');
    return response.data;
  },

  getRecruiterActivity: async () => {
    const response = await apiRequest('/dashboard/recruiter/activity');
    return response.data;
  },

  getRecruiterUpcomingInterviews: async () => {
    const response = await apiRequest('/dashboard/recruiter/upcoming-interviews');
    return response.data;
  },

  // Applicant dashboard
  getApplicantOverview: async () => {
    const response = await apiRequest('/dashboard/applicant/overview');
    return response.data;
  },

  getApplicantRecommendedJobs: async () => {
    const response = await apiRequest('/dashboard/applicant/recommended-jobs');
    return response.data?.jobs || [];
  },

  getApplicantApplications: async () => {
    const response = await apiRequest('/dashboard/applicant/applications');
    return response.data?.applications || [];
  },

  getApplicantStats: async () => {
    const response = await apiRequest('/dashboard/applicant/stats');
    return response.data;
  },
};

// Billing API
export const billingAPI = {
  getSubscription: async (orgId) => {
    const response = await apiRequest(`/organizations/${orgId}/billing/subscription`);
    return response.data;
  },

  getPlans: async (orgId) => {
    const response = await apiRequest(`/organizations/${orgId}/billing/plans`);
    return response.data?.plans || [];
  },

  subscribe: async (orgId, planData) => {
    const response = await apiRequest(`/organizations/${orgId}/billing/subscribe`, {
      method: 'POST',
      body: JSON.stringify(planData),
    });
    return response.data;
  },

  updatePlan: async (orgId, planData) => {
    const response = await apiRequest(`/organizations/${orgId}/billing/update-plan`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
    return response.data;
  },

  getInvoices: async (orgId) => {
    const response = await apiRequest(`/organizations/${orgId}/billing/invoices`);
    return response.data?.invoices || [];
  },

  getPaymentMethods: async (orgId) => {
    const response = await apiRequest(`/organizations/${orgId}/billing/payment-methods`);
    return response.data?.paymentMethods || [];
  },

  addPaymentMethod: async (orgId, paymentMethodData) => {
    const response = await apiRequest(`/organizations/${orgId}/billing/payment-methods`, {
      method: 'POST',
      body: JSON.stringify(paymentMethodData),
    });
    return response.data;
  },
};

// Admin API (Super Admin only)
export const adminAPI = {
  createOrganizationWithMembers: async (organizationData) => {
    const response = await apiRequest('/admin/organizations/create', {
      method: 'POST',
      body: JSON.stringify(organizationData),
    });
    return response.data;
  },

  getAllOrganizations: async () => {
    const response = await apiRequest('/admin/organizations');
    return response.data || [];
  },

  getOrganizationDetails: async (orgId) => {
    const response = await apiRequest(`/admin/organizations/${orgId}`);
    return response.data;
  },

  getAllRecruiters: async () => {
    const response = await apiRequest('/admin/recruiters');
    return response.data || [];
  },

  getSystemConfig: async () => {
    const response = await apiRequest('/admin/system-config');
    return response.data;
  },

  updateSystemConfig: async (configData) => {
    const response = await apiRequest('/admin/system-config', {
      method: 'PUT',
      body: JSON.stringify(configData),
    });
    return response.data;
  },

  getLoginAttempts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const queryString = queryParams.toString();
    const endpoint = `/admin/login-attempts${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  getSecurityLogs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const queryString = queryParams.toString();
    const endpoint = `/admin/security-logs${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  getAuditLogs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const queryString = queryParams.toString();
    const endpoint = `/admin/audit-logs${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  getClientLogs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const queryString = queryParams.toString();
    const endpoint = `/admin/client-logs${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  deleteLoginAttempt: async (id) => {
    const response = await apiRequest(`/admin/login-attempts/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  deleteSecurityLog: async (id) => {
    const response = await apiRequest(`/admin/security-logs/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  deleteAuditLog: async (id) => {
    const response = await apiRequest(`/admin/audit-logs/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  deleteClientLog: async (id) => {
    const response = await apiRequest(`/admin/client-logs/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  bulkDeleteLoginAttempts: async (days, startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (days !== null) {
      params.append('days', days);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    const response = await apiRequest(`/admin/login-attempts?${params.toString()}`, {
      method: 'DELETE',
    });
    return response;
  },

  bulkDeleteSecurityLogs: async (days, startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (days !== null) {
      params.append('days', days);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    const response = await apiRequest(`/admin/security-logs?${params.toString()}`, {
      method: 'DELETE',
    });
    return response;
  },

  bulkDeleteAuditLogs: async (days, startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (days !== null) {
      params.append('days', days);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    const response = await apiRequest(`/admin/audit-logs?${params.toString()}`, {
      method: 'DELETE',
    });
    return response;
  },

  bulkDeleteClientLogs: async (days, startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (days !== null) {
      params.append('days', days);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    const response = await apiRequest(`/admin/client-logs?${params.toString()}`, {
      method: 'DELETE',
    });
    return response;
  },

  getLogStatistics: async () => {
    const response = await apiRequest('/admin/logs/statistics');
    return response.data;
  },

  cleanupSoftDeletedLogs: async () => {
    const response = await apiRequest('/admin/logs/cleanup/soft-deleted', {
      method: 'POST',
    });
    return response.data;
  },

  cleanupOldActiveLogs: async () => {
    const response = await apiRequest('/admin/logs/cleanup/old-active', {
      method: 'POST',
    });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiRequest('/admin/users');
    return response.data || [];
  },

  toggleUserBan: async (userId, isBanned) => {
    const response = await apiRequest(`/admin/users/${userId}/ban`, {
      method: 'PATCH',
      body: JSON.stringify({ isBanned }),
    });
    return response.data;
  },

  getPlatformStats: async (period = '30') => {
    const response = await apiRequest(`/admin/platform-stats?period=${period}`);
    return response.data;
  },
};

// Recruiter Applications API
export const recruiterApplicationsAPI = {
  create: async (applicationData) => {
    const response = await apiRequest('/recruiter-applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
    return response.data;
  },

  getAll: async (status) => {
    const query = status ? `?status=${status}` : '';
    const response = await apiRequest(`/recruiter-applications${query}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getById: async (id) => {
    const response = await apiRequest(`/recruiter-applications/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, reviewNotes) => {
    const response = await apiRequest(`/recruiter-applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewNotes }),
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await apiRequest(`/recruiter-applications/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },
};

// AI API
export const aiAPI = {
  enhanceSummary: async (summary, profession) => {
    const response = await apiRequest('/ai/enhance-summary', {
      method: 'POST',
      body: JSON.stringify({ summary, profession }),
    });
    return response.data?.enhancedSummary;
  },

  enhanceJobDescription: async (description) => {
    const response = await apiRequest('/ai/enhance-job-description', {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
    return response.data?.enhancedDescription;
  },

  enhanceProjectDescription: async (description) => {
    const response = await apiRequest('/ai/enhance-project-description', {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
    return response.data?.enhancedDescription;
  },

  enhanceContent: async (content, contentType) => {
    const response = await apiRequest('/ai/enhance-content', {
      method: 'POST',
      body: JSON.stringify({ content, contentType }),
    });
    return response.data?.enhancedContent;
  },

  checkGrammar: async (text) => {
    const response = await apiRequest('/ai/grammar-check', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data;
  },

  getActionVerbs: async (text) => {
    const response = await apiRequest('/ai/action-verbs', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data?.suggestions || [];
  },

  rewriteBullets: async (text) => {
    const response = await apiRequest('/ai/rewrite-bullets', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data?.rewritten;
  },

  getKeywords: async (resumeText, jobDescription) => {
    const response = await apiRequest('/ai/keyword-suggestions', {
      method: 'POST',
      body: JSON.stringify({ resumeText, jobDescription }),
    });
    return response.data;
  },

  getReadability: async (text) => {
    const response = await apiRequest('/ai/readability-score', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data;
  },

  getATSOptimization: async (resumeData) => {
    const response = await apiRequest('/ai/ats-optimization', {
      method: 'POST',
      body: JSON.stringify({ resumeData }),
    });
    return response.data;
  },

  getResumeScore: async (resumeData) => {
    const response = await apiRequest('/ai/resume-score', {
      method: 'POST',
      body: JSON.stringify({ resumeData }),
    });
    return response.data;
  },

  getIndustrySuggestions: async (resumeData, industry) => {
    const response = await apiRequest('/ai/industry-suggestions', {
      method: 'POST',
      body: JSON.stringify({ resumeData, industry }),
    });
    return response.data;
  },

  matchJobDescription: async (resumeData, jobDescription) => {
    const response = await apiRequest('/ai/job-matching', {
      method: 'POST',
      body: JSON.stringify({ resumeData, jobDescription }),
    });
    return response.data;
  },

  analyzeSkillGaps: async (resumeData, targetRole) => {
    const response = await apiRequest('/ai/skill-gap-analysis', {
      method: 'POST',
      body: JSON.stringify({ resumeData, targetRole }),
    });
    return response.data;
  },

  getCareerPath: async (resumeData) => {
    const response = await apiRequest('/ai/career-path', {
      method: 'POST',
      body: JSON.stringify({ resumeData }),
    });
    return response.data;
  },

  generateCoverLetter: async (resumeData, jobDescription, companyName) => {
    const response = await apiRequest('/ai/cover-letter', {
      method: 'POST',
      body: JSON.stringify({ resumeData, jobDescription, companyName }),
    });
    return response.data?.coverLetter;
  },

  generateInterviewQuestions: async (resumeData) => {
    const response = await apiRequest('/ai/interview-prep', {
      method: 'POST',
      body: JSON.stringify({ resumeData }),
    });
    return response.data?.questions || [];
  },

  estimateSalary: async (resumeData, location, role) => {
    const response = await apiRequest('/ai/salary-estimation', {
      method: 'POST',
      body: JSON.stringify({ resumeData, location, role }),
    });
    return response.data;
  },

  parseResume: async (fileContent, fileType) => {
    const response = await apiRequest('/ai/parse-resume', {
      method: 'POST',
      body: JSON.stringify({ fileContent, fileType }),
    });
    return response.data;
  },
};

// Support API
export const supportAPI = {
  // Create a new support ticket
  createTicket: async (ticketData) => {
    const response = await apiRequest('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
    return response.data;
  },

  // Get user's support tickets
  getUserTickets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/support/tickets${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data || [];
  },

  // Get a specific ticket by ID
  getTicketById: async (ticketId) => {
    const response = await apiRequest(`/support/tickets/${ticketId}`);
    return response.data;
  },

  // Add a response to a ticket
  addResponse: async (ticketId, message) => {
    const response = await apiRequest(`/support/tickets/${ticketId}/response`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return response.data;
  },

  // Admin: Get all tickets
  getAllTickets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/support/admin/tickets${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data || [];
  },

  // Admin: Update ticket status
  updateTicketStatus: async (ticketId, status) => {
    const response = await apiRequest(`/support/admin/tickets/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  // Admin: Add internal note
  addInternalNote: async (ticketId, note) => {
    const response = await apiRequest(`/support/admin/tickets/${ticketId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return response.data;
  },

  // Admin: Get ticket statistics
  getTicketStatistics: async () => {
    const response = await apiRequest('/support/admin/statistics');
    return response.data;
  },
};

// Export token management functions
export { getToken, setToken, removeToken };

