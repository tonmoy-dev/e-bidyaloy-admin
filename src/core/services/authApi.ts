import { API_ENDPOINTS } from '../constants/api';
import type { LoginCredentials, LoginResponse, User } from '../store/types';
import {
  authUtils,
  type RegistrationData,
  type RegistrationResponse,
  type ResendVerificationData,
  type ResendVerificationResponse,
  type VerificationData,
  type VerificationResponse,
} from './authService';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Registration successful:', data);
        } catch (error) {
          console.error('Registration failed:', error);
        }
      },
    }),

    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: {
          email: credentials.username,
          password: credentials.password,
        },
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(credentials, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Store tokens and user data using authUtils
          authUtils.storeAuthData(data, credentials.rememberMe);

          console.log('Login successful, tokens stored');
        } catch (error) {
          // Handle login error
          console.error('Login failed:', error);
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => {
        // Get the refresh token for logout request
        const { refreshToken } = authUtils.getStoredTokens();

        return {
          url: API_ENDPOINTS.AUTH.LOGOUT,
          method: 'POST',
          body: refreshToken ? { refresh: refreshToken } : {},
        };
      },
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Logout API failed:', error);
        } finally {
          // Clear all stored auth data regardless of API response
          authUtils.clearStoredAuth();
        }
      },
    }),

    refreshToken: builder.mutation<{ access: string; refresh?: string }, void>({
      query: () => {
        const { refreshToken } = authUtils.getStoredTokens();
        return {
          url: API_ENDPOINTS.AUTH.REFRESH,
          method: 'POST',
          body: { refresh: refreshToken },
        };
      },
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Update stored tokens with new ones
          authUtils.updateStoredTokens(data.access, data.refresh);

          console.log('Token refresh successful');
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Clear auth data on refresh failure
          authUtils.clearStoredAuth();
        }
      },
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => API_ENDPOINTS.USER.PROFILE,
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: API_ENDPOINTS.USER.PROFILE,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<void, { old_password: string; new_password: string }>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<VerificationResponse, VerificationData>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        method: 'POST',
        body: {
          email: data.email,
          code: data.code,
        },
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Email verification successful:', data);
        } catch (error) {
          console.error('Email verification failed:', error);
        }
      },
    }),

    verifyRegistration: builder.mutation<VerificationResponse, { code: string; email: string }>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        method: 'POST',
        body: {
          email: data.email,
          code: data.code,
        },
      }),
      invalidatesTags: ['Auth'],
    }),

    resendVerificationCode: builder.mutation<ResendVerificationResponse, ResendVerificationData>({
      query: ({ email }) => ({
        url: API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
        method: 'POST',
        body: { email },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Verification code resent successfully:', data);
        } catch (error) {
          console.error('Failed to resend verification code:', error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useVerifyRegistrationMutation,
  useResendVerificationCodeMutation,
} = authApi;
