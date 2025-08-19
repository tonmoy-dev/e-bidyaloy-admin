export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://212.28.189.126:8020';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user/api/v1/user/login/',
    REFRESH: '/user/api/v1/token/refresh/',
    LOGOUT: '/user/api/v1/logout/',
  },
  POKEMON: {
    LIST: '/pokemon',
  },
};
