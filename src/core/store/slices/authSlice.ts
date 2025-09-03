import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL, API_ENDPOINTS } from '../../constants/api';
import { authUtils } from '../../services/authService';
import type { LoginCredentials, LoginResponse, User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt: number | null;
  isRefreshing: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lastLoginAttempt: null,
  isRefreshing: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || 'Login failed');
      }

      const data: LoginResponse = await response.json();

      // Store tokens and user data based on rememberMe preference
      const storage = credentials.rememberMe ? localStorage : sessionStorage;

      // Store the complete user data
      storage.setItem('user', JSON.stringify(data.user || data));

      // Extract and store tokens separately
      if (data.access) {
        storage.setItem('access_token', data.access);
      }
      if (data.refresh) {
        storage.setItem('refresh_token', data.refresh);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  },
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken =
        state.auth.refreshToken ||
        localStorage.getItem('refresh_token') ||
        sessionStorage.getItem('refresh_token');

      // Try to call logout API if we have a refresh token
      if (refreshToken) {
        try {
          const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (!response.ok) {
            console.warn('Logout API failed, but will still clear local data');
          }
        } catch (apiError) {
          console.warn('Logout API call failed:', apiError);
        }
      }

      // Always clear stored data regardless of API response
      authUtils.clearStoredAuth();
      return true;
    } catch (error) {
      // Even if everything fails, clear local storage
      authUtils.clearStoredAuth();
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
    }
  },
);

// Async thunk for refreshing token
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken =
        state.auth.refreshToken ||
        localStorage.getItem('refresh_token') ||
        sessionStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || 'Token refresh failed');
      }

      const data = await response.json();

      // Update stored tokens
      const useLocalStorage = !!localStorage.getItem('access_token');
      const storage = useLocalStorage ? localStorage : sessionStorage;

      storage.setItem('access_token', data.access);
      if (data.refresh) {
        storage.setItem('refresh_token', data.refresh);
      }

      return data;
    } catch (error) {
      // Clear auth data on refresh failure
      authUtils.clearStoredAuth();
      return rejectWithValue(error instanceof Error ? error.message : 'Token refresh failed');
    }
  },
);

// Initialize auth state from storage
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const user = authUtils.getStoredUser();
  const { accessToken, refreshToken } = authUtils.getStoredTokens();

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!(user && accessToken),
  };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
      state.isRefreshing = false;
      authUtils.clearStoredAuth();
    },
    updateTokens: (state, action: PayloadAction<{ access: string; refresh?: string }>) => {
      state.accessToken = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Initialize auth
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isLoading = false;
    });

    // Login cases
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user || action.payload;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
      state.loginAttempts += 1;
      state.lastLoginAttempt = Date.now();
    });

    // Logout cases
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
      state.isRefreshing = false;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      // Even if logout fails, clear the state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
      state.isRefreshing = false;
    });

    // Token refresh cases
    builder.addCase(refreshAuthToken.pending, (state) => {
      state.isRefreshing = true;
    });
    builder.addCase(refreshAuthToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }
      state.error = null;
      state.isRefreshing = false;
    });
    builder.addCase(refreshAuthToken.rejected, (state) => {
      // Clear auth state on refresh failure
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = 'Session expired. Please log in again.';
      state.isRefreshing = false;
    });
  },
});

export const { clearError, clearAuth, updateTokens, resetLoginAttempts, setUser, setRefreshing } =
  authSlice.actions;

export default authSlice.reducer;
