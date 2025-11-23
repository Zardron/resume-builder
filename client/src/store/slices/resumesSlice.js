import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeAPI } from '../../services/api';

// Async thunks
export const fetchResumes = createAsyncThunk(
  'resumes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const resumes = await resumeAPI.getAll();
      return resumes.map(resume => ({
        id: resume._id || resume.id,
        name: resume.name,
        date: new Date(resume.updatedAt || resume.createdAt).toLocaleDateString(),
        template: resume.template,
        isDraft: resume.isDraft,
        ...resume,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resumes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const resume = await resumeAPI.getById(id);
      return {
        id: resume._id || resume.id,
        name: resume.name,
        date: new Date(resume.updatedAt || resume.createdAt).toLocaleDateString(),
        template: resume.template,
        isDraft: resume.isDraft,
        ...resume,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createResume = createAsyncThunk(
  'resumes/create',
  async (resumeData, { rejectWithValue }) => {
    try {
      const newResume = await resumeAPI.create(resumeData);
      return {
        id: newResume._id || newResume.id,
        name: newResume.name,
        date: new Date(newResume.updatedAt || newResume.createdAt).toLocaleDateString(),
        template: newResume.template,
        isDraft: newResume.isDraft,
        ...newResume,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateResume = createAsyncThunk(
  'resumes/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const updatedResume = await resumeAPI.update(id, updates);
      return {
        id: updatedResume._id || updatedResume.id,
        name: updatedResume.name,
        date: new Date(updatedResume.updatedAt || updatedResume.createdAt).toLocaleDateString(),
        template: updatedResume.template,
        isDraft: updatedResume.isDraft,
        ...updatedResume,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resumes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await resumeAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const duplicateResume = createAsyncThunk(
  'resumes/duplicate',
  async (id, { rejectWithValue }) => {
    try {
      const duplicatedResume = await resumeAPI.duplicate(id);
      return {
        id: duplicatedResume._id || duplicatedResume.id,
        name: duplicatedResume.name,
        date: new Date(duplicatedResume.updatedAt || duplicatedResume.createdAt).toLocaleDateString(),
        template: duplicatedResume.template,
        isDraft: duplicatedResume.isDraft,
        ...duplicatedResume,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,
};

const resumesSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchResumeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResume = action.payload;
        // Update in list if exists
        const index = state.resumes.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.resumes.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
        if (state.currentResume?.id === action.payload.id) {
          state.currentResume = action.payload;
        }
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = state.resumes.filter(r => r.id !== action.payload);
        if (state.currentResume?.id === action.payload) {
          state.currentResume = null;
        }
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Duplicate
      .addCase(duplicateResume.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
      });
  },
});

export const { clearCurrentResume, setCurrentResume, clearError } = resumesSlice.actions;
export default resumesSlice.reducer;

