import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendUrl from "../../../constants";

// Helper to set auth token in axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Check for token in storage and set headers
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/register`, userData);
      // Set auth token in headers
      setAuthToken(response.data.token);
      
      // Transform response to match our state
      return {
        userid: response.data._id,
        username: response.data.username,
        email: response.data.email,
        token: response.data.token
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, credentials);
      // Set auth token in headers
      setAuthToken(response.data.token);
      
      // Transform response to match our state
      return {
        userid: response.data._id,
        username: response.data.username,
        email: response.data.email,
        token: response.data.token
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/auth/profile`);
      
      // Transform response to match our state
      return {
        userid: response.data._id,
        username: response.data.username,
        email: response.data.email
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${backendUrl}/auth/profile`, profileData);
      
      // Transform response to match our state
      return {
        userid: response.data._id,
        username: response.data.username,
        email: response.data.email,
        token: response.data.token
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

const initialState = {
    userid: undefined,
    username: undefined,
    email: undefined,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signoutUser(state) {
            state.userid = undefined;
            state.username = undefined;
            state.email = undefined;
            state.token = null;
            state.loading = false;
            state.error = null;
            setAuthToken(null);
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
                state.token = action.payload.token;
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
                state.token = action.payload.token;
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
                state.userid = action.payload.userid;
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.token = action.payload.token;
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