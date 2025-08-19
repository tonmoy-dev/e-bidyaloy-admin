export type { AuthState, LoginCredentials, LoginResponse, User } from './slices/authSlice';

export interface ApiError {
  message: string;
  status?: number;
  field?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
