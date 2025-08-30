// 1. Enhanced authSlice.ts with proper logout handling
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL, API_ENDPOINTS } from '../../constants/api';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  user_type: string;
  date_joined: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt: number | null;
  isRefreshing: boolean;
  accessToken: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
  message: string;
}

// Enhanced logout that works even without API
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.accessToken;

      // Try to call logout API if available and we have a token
      if (token) {
        try {
          await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
        } catch (apiError) {
          // Log API error but don't fail logout
          console.warn('Logout API call failed, proceeding with local logout:', apiError);
        }
      }

      // Always clear local storage regardless of API response
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');

      return;
    } catch {
      // Even if everything fails, we should still clear local state
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');

      return rejectWithValue('Logout completed with errors');
    }
  },
);

export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store tokens and user data
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(data.user));
      storage.setItem('access_token', data.access);
      storage.setItem('refresh_token', data.refresh);

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  },
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lastLoginAttempt: null,
  isRefreshing: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      state.accessToken = null;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    initializeAuth: (state) => {
      // Check for stored user data and tokens
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      const storedToken =
        localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          state.user = userData;
          state.isAuthenticated = true;
          state.accessToken = storedToken;
        } catch (error) {
          console.error('Failed to parse stored auth data:', error);
          // Clear invalid stored data
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.error = null;
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.loginAttempts += 1;
        state.lastLoginAttempt = Date.now();
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Always clear state on logout, regardless of API response
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = null;
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout API fails, clear local state
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = null;
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
      });
  },
});

export const { clearError, resetLoginAttempts, setUser, clearAuth, initializeAuth } =
  authSlice.actions;
export default authSlice.reducer;
