export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://school.jordanbikestation.com';
//'http://192.168.68.129:8010/';
//http://212.28.189.126:8021
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
    LIST: (params?: Record<string, unknown>) => ({
      url: `/api/v1/classes/`,
      method: 'GET',
      params,
    }),
    CREATE: () => ({ url: '/api/v1/classes/', method: 'POST' }),
    DETAILS: (id: number | string) => ({ url: `/api/v1/classes/${id}`, method: 'GET' }),
    UPDATE: (id: number | string) => ({ url: `/api/v1/classes/${id}`, method: 'PUT' }),
    DELETE: (id: number | string) => ({ url: `/api/v1/classes/${id}`, method: 'DELETE' }),
  },
  SESSION: {
    LIST: (params?: Record<string, unknown>) => ({
      url: `/api/v1/academic-years/`,
      method: 'GET',
      params,
    }),
    CREATE: () => ({ url: '/api/v1/academic-years/', method: 'POST' }),
    DETAILS: (id: number | string) => ({ url: `/api/v1/academic-years/${id}`, method: 'GET' }),
    UPDATE: (id: number | string) => ({ url: `/api/v1/academic-years/${id}`, method: 'PUT' }),
    DELETE: (id: number | string) => ({ url: `/api/v1/academic-years/${id}`, method: 'DELETE' }),
  },
};
