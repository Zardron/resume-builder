import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionAPI } from '../../services/api';

// Async thunks
export const fetchSubscriptionStatus = createAsyncThunk(
  'subscriptions/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getStatus();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const subscribe = createAsyncThunk(
  'subscriptions/subscribe',
  async ({ paymentMethod, subscriptionDuration = 1, planId = 'enterprise' }, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.subscribe(paymentMethod, subscriptionDuration, planId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscriptions/cancel',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.cancel();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reactivateSubscription = createAsyncThunk(
  'subscriptions/reactivate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.reactivate();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const upgradeSubscription = createAsyncThunk(
  'subscriptions/upgrade',
  async ({ planId, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.upgrade(planId, paymentMethod);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  subscription: null,
  isSubscribed: false,
  isLoading: false,
  error: null,
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.subscription = action.payload;
      state.isSubscribed = action.payload?.status === 'active';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch status
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload.subscription;
        state.isSubscribed = action.payload.isSubscribed || action.payload.subscription?.status === 'active';
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Subscribe
      .addCase(subscribe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(subscribe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload.subscription;
        state.isSubscribed = action.payload.subscription?.status === 'active';
      })
      .addCase(subscribe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload.subscription;
        state.isSubscribed = action.payload.subscription?.status === 'active';
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reactivate
      .addCase(reactivateSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reactivateSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload.subscription;
        state.isSubscribed = action.payload.subscription?.status === 'active';
      })
      .addCase(reactivateSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upgrade
      .addCase(upgradeSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(upgradeSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload.subscription;
        state.isSubscribed = action.payload.subscription?.status === 'active';
      })
      .addCase(upgradeSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSubscription, clearError } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;

