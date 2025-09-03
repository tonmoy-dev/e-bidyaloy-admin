import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../core/store';
import {
  clearAuth,
  initializeAuth,
  logoutUser,
  refreshAuthToken,
  setRefreshing,
} from '../../core/store/slices/authSlice';
import { all_routes } from '../../features/router/all_routes';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useAppSelector((state) => state.auth);

  // Initialize auth state from storage on first load
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      dispatch(initializeAuth());
    }
  }, [dispatch, authState.isAuthenticated, authState.isLoading]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      // Always redirect to login regardless of API response
      navigate(all_routes.login, { replace: true });
    }
  }, [dispatch, navigate]);

  const refreshToken = useCallback(async () => {
    if (authState.isRefreshing) {
      return false; // Already refreshing
    }

    try {
      dispatch(setRefreshing(true));
      await dispatch(refreshAuthToken()).unwrap();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, clear auth and redirect to login
      dispatch(clearAuth());
      navigate(all_routes.login, { replace: true });
      return false;
    } finally {
      dispatch(setRefreshing(false));
    }
  }, [dispatch, navigate, authState.isRefreshing]);

  const isUserType = useCallback(
    (userType: string) => {
      return authState.user?.role === userType;
    },
    [authState.user],
  );

  const hasAccess = useCallback(
    (allowedTypes: string[]) => {
      const userType = authState.user?.role;
      return userType ? allowedTypes.includes(userType) : false;
    },
    [authState.user],
  );

  // Helper function to check if user is authenticated with valid token
  const isAuthenticated = useCallback(() => {
    return authState.isAuthenticated && authState.accessToken && authState.user;
  }, [authState.isAuthenticated, authState.accessToken, authState.user]);

  // Helper function to get current user safely
  const getCurrentUser = useCallback(() => {
    return authState.user;
  }, [authState.user]);

  // Helper function to get access token
  const getAccessToken = useCallback(() => {
    return authState.accessToken;
  }, [authState.accessToken]);

  // Helper function to check if tokens need refresh (proactive refresh)
  const shouldRefreshToken = useCallback(() => {
    if (!authState.accessToken || authState.isRefreshing) return false;

    try {
      // Decode JWT token to check expiry
      const tokenParts = authState.accessToken.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Refresh if token expires in the next 5 minutes (300 seconds)
      return payload.exp && payload.exp - currentTime < 300;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return false;
    }
  }, [authState.accessToken, authState.isRefreshing]);

  // Auto-refresh token when needed
  useEffect(() => {
    if (shouldRefreshToken() && !authState.isRefreshing) {
      refreshToken();
    }
  }, [shouldRefreshToken, refreshToken, authState.isRefreshing]);

  // Check authentication status periodically
  useEffect(() => {
    const checkAuthStatus = () => {
      if (isAuthenticated() && shouldRefreshToken()) {
        refreshToken();
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, shouldRefreshToken, refreshToken]);

  return {
    ...authState,
    logout,
    refreshToken,
    isUserType,
    hasAccess,
    isAuthenticated,
    getCurrentUser,
    getAccessToken,
    shouldRefreshToken,
  };
};
