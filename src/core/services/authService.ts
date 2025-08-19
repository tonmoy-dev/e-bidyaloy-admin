import type { LoginCredentials, LoginResponse, User } from '../store/types';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/user/api/v1/user/login/',
        method: 'POST',
        body: {
          email: credentials.email,
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
        url: '/user/api/v1/logout/',
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
        url: '/user/api/v1/token/refresh/',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/user/api/v1/user/profile/',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/user/api/v1/user/profile/',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<void, { old_password: string; new_password: string }>({
      query: (data) => ({
        url: '/user/api/v1/user/change-password/',
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: '/user/api/v1/user/forgot-password/',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: (data) => ({
        url: '/user/api/v1/user/reset-password/',
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: '/user/api/v1/user/verify-email/',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
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
