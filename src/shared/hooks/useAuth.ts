import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../core/store';
import { logoutUser } from '../../core/store/slices/authSlice';
import { all_routes } from '../../features/router/all_routes';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useAppSelector((state) => state.auth);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate(all_routes.login, { replace: true });
    } catch (error) {
      // Still redirect even if logout fails
      navigate(all_routes.login, { replace: true });
    }
  }, [dispatch, navigate]);

  const isUserType = useCallback(
    (userType: string) => {
      return authState.user?.user_type === userType;
    },
    [authState.user],
  );

  const hasAccess = useCallback(
    (allowedTypes: string[]) => {
      return authState.user?.user_type ? allowedTypes.includes(authState.user.user_type) : false;
    },
    [authState.user],
  );

  return {
    ...authState,
    logout,
    isUserType,
    hasAccess,
  };
};
