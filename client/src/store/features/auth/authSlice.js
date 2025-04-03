import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/auth/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/auth/profile", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
    userid: undefined,
    username: undefined,
    email: undefined,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signoutUser(state) {
            state.userid = initialState.userid;
            state.username = initialState.username;
            state.email = initialState.email;
            state.loading = false;
            state.error = null;
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userid = action.payload.userid;
                state.username = action.payload.username;
                state.email = action.payload.email;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userid = action.payload.userid;
                state.username = action.payload.username;
                state.email = action.payload.email;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Profile
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userid = action.payload.userid;
                state.username = action.payload.username;
                state.email = action.payload.email;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.username = action.payload.username;
                state.email = action.payload.email;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Actions
export const { signoutUser, clearError } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth;
export const selectIsAuthenticated = (state) => !!state.auth.userid;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer; 