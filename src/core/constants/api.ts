export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://212.28.189.126:8021';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login/',
    REGISTER: '/api/v1/auth/register/',
    REFRESH: '/api/v1/auth/token/refresh/',
    LOGOUT: '/api/v1/auth/logout/',
    VERIFY_EMAIL: '/api/v1/auth/verify/',
    RESEND_VERIFICATION: '/api/v1/auth/resend-verification/',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password/',
    RESET_PASSWORD: '/api/v1/auth/reset-password/',
  },
  USER: {
    PROFILE: '/user/api/v1/user/profile/',
    CHANGE_PASSWORD: '/user/api/v1/user/change-password/',
  },
  POKEMON: {
    LIST: '/pokemon',
  },
  CLASS: {
    LIST: '/api/v1/classes/',
    CREATE: '/api/v1/classes/',
    UPDATE_BY_ID: '/api/v1/classes/',
    DELETE_BY_ID: '/api/v1/classes/',
    DETAILS_BY_ID: '/api/v1/classes/',
  },
  SESSION: {
    LIST: '/api/v1/sessions/',
    CREATE: '/api/v1/sessions/',
    UPDATE_BY_ID: '/api/v1/sessions/',
    DELETE_BY_ID: '/api/v1/sessions/',
    DETAILS_BY_ID: '/api/v1/sessions/',
  }
};
