import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../../lib/apiClient';

// Get user from localStorage if exists
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

// Create async thunks
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            
            // Store token and user data in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            // Store user data with userid instead of _id
            const userData = {
                userid: response._id,
                username: response.username,
                email: response.email
            };
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();
            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Get user profile
export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getProfile();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get profile');
        }
    }
);

// Update user profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await authApi.updateProfile(profileData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

// Create slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userid: user?.userid || null,
        username: user?.username || null,
        email: user?.email || null,
        token: token || null,
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.userid = action.payload.userid;
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.token = localStorage.getItem('token');
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.userid = null;
                state.username = null;
                state.email = null;
                state.token = null;
                state.error = null;
            })
            // Get Profile
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userid = action.payload.userid;
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.token = action.payload.token;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userid = action.payload.userid;
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.token = action.payload.token;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 