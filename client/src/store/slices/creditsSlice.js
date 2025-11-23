import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { creditsAPI } from '../../services/api';

// Async thunks
export const fetchCreditsBalance = createAsyncThunk(
  'credits/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const balance = await creditsAPI.getBalance();
      return balance;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCreditTransactions = createAsyncThunk(
  'credits/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const transactions = await creditsAPI.getTransactions();
      return transactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
};

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    addCredits: (state, action) => {
      state.balance += action.payload;
    },
    useCredits: (state, action) => {
      state.balance = Math.max(0, state.balance - action.payload);
    },
    setCredits: (state, action) => {
      state.balance = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch balance
      .addCase(fetchCreditsBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCreditsBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload;
      })
      .addCase(fetchCreditsBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch transactions
      .addCase(fetchCreditTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCreditTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchCreditTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addCredits, useCredits, setCredits, clearError } = creditsSlice.actions;
export default creditsSlice.reducer;

