import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import type { AppDispatch } from '../store'; // Import AppDispatch type
import { store } from '../store';
import { initializeAuth } from '../store/slices/authSlice';

const AuthInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>(); // Type dispatch

  useEffect(() => {
    // Initialize auth state from localStorage/sessionStorage on app startup
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
};
