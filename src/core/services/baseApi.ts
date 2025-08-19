import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { clearAuth, refreshToken } from '../store/slices/authSlice';

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include', // Always include HTTP-only cookies
    prepareHeaders: (headers) => {
      // Set content type for JSON requests
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json');
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - attempt token refresh
  if (result.error && result.error.status === 401) {
    const requestUrl = typeof args === 'string' ? args : args.url;

    // Don't refresh on login endpoint
    if (!requestUrl.includes(API_ENDPOINTS.AUTH.LOGIN)) {
      console.log('401 detected, attempting token refresh');

      // Attempt to refresh token
      const refreshResult = await baseQuery(
        {
          url: API_ENDPOINTS.AUTH.REFRESH,
          method: 'POST',
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        console.log('Token refresh successful, retrying original request');
        // Dispatch refresh action to update Redux state
        api.dispatch(refreshToken());

        // Retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log('Token refresh failed, clearing auth');
        // Refresh failed, clear auth and redirect
        api.dispatch(clearAuth());
        window.location.href = '/login';
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}),
});
