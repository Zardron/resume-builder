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
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

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
      // Handle 403 (forbidden) - might be email verification required
      if (response.status === 403 && data.requiresVerification) {
        const error = new Error(data.message || 'Email verification required');
        error.requiresVerification = true;
        error.email = data.data?.user?.email;
        throw error;
      }
      
      // Attach status code to error for better handling
      const error = new Error(data.message || 'Request failed');
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  } catch (error) {
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
    
    console.error('API Error:', error);
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

  resendVerification: async () => {
    return await apiRequest('/auth/resend-verification', {
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

  subscribe: async (paymentMethod, subscriptionDuration = 1) => {
    const response = await apiRequest('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ paymentMethod, subscriptionDuration }),
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
    return response.data?.conversations || [];
  },

  getConversationById: async (id) => {
    const response = await apiRequest(`/messages/conversations/${id}`);
    return response.data?.conversation;
  },

  getOrCreateConversation: async (applicationId) => {
    const response = await apiRequest(`/messages/conversations/${applicationId}`);
    return response.data?.conversation;
  },

  getMessages: async (conversationId) => {
    const response = await apiRequest(`/messages/conversations/${conversationId}/messages`);
    return response.data?.messages || [];
  },

  sendMessage: async (conversationId, messageData) => {
    const response = await apiRequest(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    return response.data?.message;
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

// Export token management functions
export { getToken, setToken, removeToken };

