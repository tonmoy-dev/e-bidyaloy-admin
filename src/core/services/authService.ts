import { API_ENDPOINTS } from '../constants/api';
import type { LoginCredentials, LoginResponse, User } from '../store/types';
import { baseApi } from './baseApi';

export interface RegistrationData {
  // Backend required fields
  name: string;
  slug: string;
  website?: string;
  ieen_no: string;
  phone: string;
  email: string;
  admin_username: string;
  admin_email: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_password: string;
  admin_password_confirm: string;

  // Additional data (optional)
  additional_data?: {
    address?: string;
    total_teachers?: number;
    total_students?: number;
    classes?: string;
    total_sections?: number;
    has_biometric_system?: boolean;
    has_unique_ids?: boolean;
    has_existing_website?: boolean;
  };
}

export interface RegistrationResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    subscription_plan: string;
  };
  message: string;
}

export interface VerificationData {
  token: string;
  code?: string;
}

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
          // Store user data based on rememberMe preference
          const storage = credentials.rememberMe ? localStorage : sessionStorage;
          storage.setItem('user', JSON.stringify(data));
        } catch (error) {
          // Handle login error
          console.error('Login failed:', error);
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Logout API failed:', error);
        } finally {
          // Clear stored user data regardless of API response
          localStorage.removeItem('user');
          sessionStorage.removeItem('user');
        }
      },
    }),

    refreshToken: builder.mutation<{ access: string }, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.REFRESH,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
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

    verifyEmail: builder.mutation<void, VerificationData>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        method: 'POST',
        body: data,
      }),
    }),

    // Additional verification endpoint if needed for registration
    verifyRegistration: builder.mutation<void, { code: string; email: string }>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        method: 'POST',
        body: data,
      }),
    }),

    // Resend verification code
    resendVerificationCode: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
        method: 'POST',
        body: { email },
      }),
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

export const authUtils = {
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return !!user;
  },

  getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData.user || userData;
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
    return null;
  },

  clearStoredAuth(): void {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  },
};
