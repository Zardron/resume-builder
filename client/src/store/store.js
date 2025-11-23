import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import resumesReducer from './slices/resumesSlice';
import creditsReducer from './slices/creditsSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resumes: resumesReducer,
    credits: creditsReducer,
    subscriptions: subscriptionsReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Type definitions for TypeScript (if migrating to TS)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

