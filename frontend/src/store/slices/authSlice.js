// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, restaurants } from '../../services/api';

// Async thunks for authentication
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await auth.login(credentials);
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await auth.register(userData);
      if (response.data.user) {
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Registration Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        throw new Error('No token found');
      }

      console.log('Fetching current user with token');
      const response = await auth.getCurrentUser();
      console.log('Current user response:', response.data);
      
      if (response.data.user) {
        if (response.data.user.role === 'responsable') {
          try {
            const restaurantResponse = await restaurants.getRestaurantByResponsable(response.data.user._id);
            response.data.user.restaurant = restaurantResponse.data;
          } catch (restaurantError) {
            console.error('Error fetching restaurant data:', restaurantError);
          }
        }
        return response.data;
      } else {
        console.log('Invalid response format from getCurrentUser');
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Get Current User Error:', error);
      // Only clear localStorage if it's an authentication error
      if (error.response?.status === 401) {
        console.log('Authentication error, clearing localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    status: 'idle',
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      state.token = token;
      state.user = user;
      state.isAuthenticated = !!token;
    },
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Save to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  }
});

export const { clearError, initializeAuth, setAuthState } = authSlice.actions;
export default authSlice.reducer;
