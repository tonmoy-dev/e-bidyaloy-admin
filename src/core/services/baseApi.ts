import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { RootState } from '../store';
import { clearAuth, updateTokens } from '../store/slices/authSlice';

// Helper function to get stored tokens
const getStoredTokens = () => {
  const accessToken =
    localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const refreshToken =
    localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  return { accessToken, refreshToken };
};

// Helper function to update stored tokens
const updateStoredTokens = (access: string, refresh?: string) => {
  // Determine which storage was used originally
  const useLocalStorage = !!localStorage.getItem('access_token');
  const storage = useLocalStorage ? localStorage : sessionStorage;

  storage.setItem('access_token', access);
  if (refresh) {
    storage.setItem('refresh_token', refresh);
  }
};

// Helper function to clear stored tokens
const clearStoredTokens = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state first, fallback to storage
      const state = getState() as RootState;
      const token = state.auth.accessToken || getStoredTokens().accessToken;

      // Add authorization header if token exists
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      const skipContentType = headers.get('skip-content-type');

      if (skipContentType) {
        headers.delete('skip-content-type');
      } else if (!headers.has('content-type')) {
        // When body is FormData, let the browser set multipart/form-data automatically
        const isFormData =
          typeof args === 'object' && args !== null && args.body instanceof FormData;

        if (!isFormData) {
          // Default to JSON when caller has not provided a body-specific content type
          headers.set('content-type', 'application/json');
        }
      }

      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - attempt token refresh
  if (result.error && result.error.status === 401) {
    const requestUrl = typeof args === 'string' ? args : args.url;

    // Don't refresh on auth endpoints to avoid infinite loops
    const isAuthEndpoint = [
      API_ENDPOINTS.AUTH.LOGIN,
      API_ENDPOINTS.AUTH.REGISTER,
      API_ENDPOINTS.AUTH.REFRESH,
      API_ENDPOINTS.AUTH.LOGOUT,
    ].some((endpoint) => requestUrl.includes(endpoint));

    if (!isAuthEndpoint) {
      console.log('401 detected, attempting token refresh');

      // Get refresh token from storage or Redux state
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refreshToken || getStoredTokens().refreshToken;

      if (refreshToken) {
        // Attempt to refresh token
        const refreshResult = await baseQuery(
          {
            url: API_ENDPOINTS.AUTH.REFRESH,
            method: 'POST',
            body: { refresh: refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          console.log('Token refresh successful, retrying original request');

          // Extract new tokens from response
          const refreshData = refreshResult.data as { access: string; refresh?: string };

          // Update stored tokens
          updateStoredTokens(refreshData.access, refreshData.refresh);

          // Update Redux state
          api.dispatch(
            updateTokens({
              access: refreshData.access,
              refresh: refreshData.refresh,
            }),
          );

          // Retry the original query with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log('Token refresh failed, clearing auth');
          // Refresh failed, clear everything
          clearStoredTokens();
          api.dispatch(clearAuth());

          // Only redirect if not already on auth pages
          if (
            !window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/register')
          ) {
            window.location.href = '/login';
          }
        }
      } else {
        console.log('No refresh token available, clearing auth');
        // No refresh token, clear auth
        clearStoredTokens();
        api.dispatch(clearAuth());

        if (
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')
        ) {
          window.location.href = '/login';
        }
      }
    }
  }

  // Handle other auth-related errors
  if (result.error) {
    const status = result.error.status;

    // Handle 403 Forbidden (insufficient permissions)
    if (status === 403) {
      console.log('403 Forbidden - insufficient permissions');
    }

    // Handle network errors
    if (status === 'FETCH_ERROR' || status === 'PARSING_ERROR') {
      console.log('Network or parsing error:', result.error);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Auth',
    'School',
    'Student',
    'Teacher',
    'Staff',
    'Class',
    'Subject',
    'Session',
    'ExamType',
    'Exam',
    'Grade',
    'Syllabus',
    'Assignment',
    'AssignmentAttachment',
    'Notice',
    'PaymentGateway',
    'ExamResult',
    'StudentType',
    'Application',
    'Complaint',
  ],
  endpoints: () => ({}),
});
