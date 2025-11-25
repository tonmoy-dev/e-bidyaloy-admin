import { API_ENDPOINTS } from '../../../core/constants/api';
import { baseApi } from '../../../core/services/baseApi';

interface SendVerificationCodeRequest {
  email: string;
}

interface SendVerificationCodeResponse {
  message: string;
  email: string;
}

interface VerifyCodeRequest {
  email: string;
  code: string;
}

interface VerifyCodeResponse {
  message: string;
  is_valid: boolean;
}

interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
  confirm_password: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const resetPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendVerificationCode: builder.mutation<
      SendVerificationCodeResponse,
      SendVerificationCodeRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.RESET_PASSWORD.SEND_VERIFICATION_CODE,
        method: 'POST',
        body: data,
      }),
    }),

    verifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.RESET_PASSWORD.VERIFY,
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.RESET_PASSWORD.RESET,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useSendVerificationCodeMutation, useVerifyCodeMutation, useResetPasswordMutation } =
  resetPasswordApi;
