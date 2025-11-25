// src/hooks/useUserRole.js

import { USER_ROLES } from '../../core/constants/roles';
import { authUtils } from '../../core/services/authService';

export const useUserRole = () => {
  const user = authUtils.getStoredUser();
  const userRole = user?.user_type || null;

  return {
    userRole,
    isAdmin: userRole === USER_ROLES.ADMIN,
    isTeacher: userRole === USER_ROLES.TEACHER,
    isStudent: userRole === USER_ROLES.STUDENT,
    isParent: userRole === USER_ROLES.PARENT,
  };
};
