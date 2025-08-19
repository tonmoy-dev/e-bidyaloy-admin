import { useAppDispatch, useAppSelector } from '../../core/store';
import { clearError, loginUser, logoutUser, refreshToken } from '../../core/store/slices/authSlice';
import type { LoginCredentials } from '../../core/store/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials)).unwrap();
  };

  const logout = async () => {
    return dispatch(logoutUser()).unwrap();
  };

  const refresh = async () => {
    return dispatch(refreshToken()).unwrap();
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    login,
    logout,
    refresh,
    clearError: clearAuthError,
  };
};
