import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { getToken, removeToken, setToken } from '../../services/api';

// Track if initialization is in progress to prevent race conditions
let initializationInProgress = false;
let initializationPromise = null;

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    // Prevent multiple simultaneous initializations
    // If one is already in progress, wait for it to complete
    if (initializationInProgress && initializationPromise) {
      return await initializationPromise;
    }

    // Start new initialization
    initializationInProgress = true;
    initializationPromise = (async () => {
      try {
        const token = getToken();
        if (!token) {
          return { isAuthenticated: false };
        }

        const response = await authAPI.getCurrentUser();
        if (response.success && response.data?.user) {
          return {
            isAuthenticated: true,
            user: response.data.user,
          };
        }
        
        // Only remove token if we got a response but it's not successful
        // This means the token is actually invalid
        if (response && !response.success) {
          removeToken();
        }
        return { isAuthenticated: false };
      } catch (error) {
        // Only remove token for actual authentication errors, not network errors
        const isAuthError = error.status === 401 || 
                           (error.message && (
                             error.message.includes('Authentication required') ||
                             error.message.includes('Invalid token') ||
                             error.message.includes('Token expired') ||
                             error.message.includes('User not found')
                           ));
        
        const isNetworkError = error.isNetworkError || 
                              error.name === 'TypeError' || 
                              error.status === 0;
        
        // Don't remove token on network errors - user might just have connectivity issues
        if (isAuthError && !isNetworkError) {
          removeToken();
        }
        
        // For network errors, don't fail initialization - keep current state
        if (isNetworkError) {
          return rejectWithValue({
            message: 'Network error. Please check your connection.',
            isNetworkError: true,
          });
        }
        
        return rejectWithValue(error.message || 'Authentication failed');
      } finally {
        initializationInProgress = false;
        initializationPromise = null;
      }
    })();

    return await initializationPromise;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, remember = false }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password, remember);
      if (response.success && response.data?.user) {
        return {
          user: response.data.user,
          token: response.data.token,
          remember,
        };
      }
      return rejectWithValue(response.message || 'Login failed');
    } catch (error) {
      // Handle 403 status (email not verified)
      if (error.requiresVerification) {
        return rejectWithValue({
          message: error.message || 'Please verify your email address',
          requiresVerification: true,
          email: error.email,
        });
      }
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, password, userType = 'applicant', organization }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(fullName, email, password, userType, organization);
      if (response.success && response.data?.user) {
        return {
          user: response.data.user,
          token: response.data.token,
          requiresVerification: response.data.requiresVerification || false,
        };
      }
      return rejectWithValue(response.message || 'Registration failed');
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      removeToken();
      return true;
    } catch (error) {
      removeToken();
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(updates);
      if (response.success && response.data?.user) {
        return response.data.user;
      }
      return rejectWithValue(response.message || 'Update failed');
    } catch (error) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

const initialState = {
  user: {
    id: null,
    name: '',
    fullName: '',
    email: '',
    role: 'applicant',
    userType: 'applicant',
    profile: {},
    preferences: {},
    resumeDefaults: {},
    stats: {},
    credits: 0,
    subscription: null,
  },
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserLocal: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload.isAuthenticated) {
          state.isAuthenticated = true;
          const userCredits = action.payload.user.credits || 0;
          const userSubscription = action.payload.user.subscription || null;
          
          state.user = {
            id: action.payload.user.id,
            name: action.payload.user.fullName || action.payload.user.name,
            fullName: action.payload.user.fullName,
            email: action.payload.user.email,
            role: action.payload.user.role || 'applicant',
            userType: action.payload.user.userType || 'applicant',
            profile: action.payload.user.profile || {},
            preferences: action.payload.user.preferences || {},
            resumeDefaults: action.payload.user.resumeDefaults || {},
            stats: action.payload.user.stats || {},
            credits: userCredits,
            subscription: userSubscription,
          };
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        
        // Only clear authentication state if it's an actual auth error, not a network error
        // This prevents logout on network issues
        const isNetworkError = action.payload?.isNetworkError || false;
        const token = getToken();
        
        // If we have a token and it's just a network error, keep the current auth state
        // The user might just have connectivity issues
        if (!isNetworkError || !token) {
          state.isAuthenticated = false;
        }
        // For network errors with a token, keep the state as-is (might be authenticated)
        // The error will be logged but user won't be logged out
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.user.id,
          name: action.payload.user.fullName || action.payload.user.name,
          fullName: action.payload.user.fullName,
          email: action.payload.user.email,
          role: action.payload.user.role || 'applicant',
          userType: action.payload.user.userType || 'applicant',
          profile: action.payload.user.profile || {},
          preferences: action.payload.user.preferences || {},
          resumeDefaults: action.payload.user.resumeDefaults || {},
          stats: action.payload.user.stats || {},
          credits: action.payload.user.credits || 0,
          subscription: action.payload.user.subscription || null,
        };
        if (action.payload.token) {
          setToken(action.payload.token, action.payload.remember || false);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.user.id,
          name: action.payload.user.fullName || action.payload.user.name,
          fullName: action.payload.user.fullName,
          email: action.payload.user.email,
          role: action.payload.user.role || 'applicant',
          userType: action.payload.user.userType || 'applicant',
          profile: action.payload.user.profile || {},
          preferences: action.payload.user.preferences || {},
          resumeDefaults: action.payload.user.resumeDefaults || {},
          stats: action.payload.user.stats || {},
          credits: action.payload.user.credits || 0,
          subscription: action.payload.user.subscription || null,
        };
        if (action.payload.token) {
          setToken(action.payload.token, true);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = initialState.user;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateUserLocal } = authSlice.actions;
export default authSlice.reducer;

