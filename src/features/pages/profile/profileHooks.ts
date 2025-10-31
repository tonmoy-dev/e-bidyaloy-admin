import { API_ENDPOINTS } from '../../../core/constants/api';
import { baseApi } from '../../../core/services/baseApi';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
  email: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  profile_picture_url?: string;
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getProfile: builder.query<User, void>({
      query: () => API_ENDPOINTS.USER.PROFILE,
      providesTags: [{ type: 'User', id: 'PROFILE' }],
    }),

    // Update user profile (with FormData for file upload)
    updateProfile: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.USER.PROFILE,
        method: 'PUT',
        body: formData,
        headers: { 'skip-content-type': 'true' },
      }),
      invalidatesTags: [{ type: 'User', id: 'PROFILE' }],
    }),

    // Change password
    changePassword: builder.mutation<{ message: string }, PasswordChangeData>({
      query: (passwordData) => ({
        url: API_ENDPOINTS.USER.CHANGE_PASSWORD,
        method: 'POST',
        body: passwordData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } =
  profileApi;
