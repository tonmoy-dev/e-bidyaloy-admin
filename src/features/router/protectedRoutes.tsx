import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../core/store';
import { all_routes } from './all_routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUserTypes = [] }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to={all_routes.login} state={{ from: location }} replace />;
  }

  // Check user type permissions if specified
  if (allowedUserTypes.length > 0 && user) {
    if (!allowedUserTypes.includes(user.user_type)) {
      // Redirect to appropriate dashboard based on user type
      const dashboardRoute = getDashboardRouteByUserType(user.user_type);
      return <Navigate to={dashboardRoute} replace />;
    }
  }

  return <>{children}</>;
};

// Helper function to get dashboard route by user type
const getDashboardRouteByUserType = (userType: string): string => {
  switch (userType) {
    case 'admin':
      return all_routes.adminDashboard;
    case 'teacher':
      return all_routes.teacherDashboard;
    case 'student':
      return all_routes.studentDashboard;
    case 'parent':
      return all_routes.parentDashboard;
    default:
      return all_routes.adminDashboard;
  }
};

export default ProtectedRoute;
