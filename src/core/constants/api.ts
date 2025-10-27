export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://school.jordanbikestation.com';

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
    LIST_WP: () => ({ url: '/api/v1/classes_wp/', method: 'GET' }),
    CREATE: () => ({ url: '/api/v1/classes/', method: 'POST' }),
    DETAILS: (id: number | string) => ({ url: `/api/v1/classes/${id}/`, method: 'GET' }),
    UPDATE: (id: number | string) => ({ url: `/api/v1/classes/${id}/`, method: 'PUT' }),
    DELETE: (id: number | string) => ({ url: `/api/v1/classes/${id}/`, method: 'DELETE' }),
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
  TEACHER: {
    LIST: '/api/v1/teachers/',
    CREATE: '/api/v1/teachers/',
    UPDATE_BY_ID: '/api/v1/teachers/',
    DELETE_BY_ID: '/api/v1/teachers/',
    DETAILS_BY_ID: '/api/v1/teachers/',
  },
  SUBJECT: {
    LIST: (params?: Record<string, unknown>) => ({
      url: `/api/v1/subjects/`,
      method: 'GET',
      params,
    }),
    CREATE: () => ({ url: '/api/v1/subjects/', method: 'POST' }),
    LIST_WP: () => ({ url: '/api/v1/subjects_wp/', method: 'GET' }),
    DETAILS: (id: string) => ({ url: `/api/v1/subjects/${id}/`, method: 'GET' }),
    UPDATE: (id: string) => ({ url: `/api/v1/subjects/${id}/`, method: 'PUT' }),
    PARTIAL_UPDATE: (id: string) => ({ url: `/api/v1/subjects/${id}/`, method: 'PATCH' }),
    DELETE: (id: string) => ({ url: `/api/v1/subjects/${id}/`, method: 'DELETE' }),
  },
  // Syllabus endpoints
  SYLLABUS: {
    LIST: (params?: Record<string, unknown>) => ({
      url: `/api/v1/syllabus/`,
      method: 'GET',
      params,
    }),
    CREATE: () => ({ url: '/api/v1/syllabus/', method: 'POST' }),
    DETAILS: (id: string) => ({ url: `/api/v1/syllabus/${id}/`, method: 'GET' }),
    UPDATE: (id: string) => ({ url: `/api/v1/syllabus/${id}/`, method: 'PUT' }),
    PARTIAL_UPDATE: (id: string) => ({ url: `/api/v1/syllabus/${id}/`, method: 'PATCH' }),
    DELETE: (id: string) => ({ url: `/api/v1/syllabus/${id}/`, method: 'DELETE' }),
  },

  // Grades endpoints
  GRADES: {
    LIST: (params?: Record<string, unknown>) => ({
      url: `/api/v1/grades/`,
      method: 'GET',
      params,
    }),
    LIST_WP: () => ({ url: '/api/v1/grades_wp/', method: 'GET' }),
    CREATE: () => ({ url: '/api/v1/grades/', method: 'POST' }),
    DETAILS: (id: string) => ({ url: `/api/v1/grades/${id}/`, method: 'GET' }),
    UPDATE: (id: string) => ({ url: `/api/v1/grades/${id}/`, method: 'PUT' }),
    PARTIAL_UPDATE: (id: string) => ({ url: `/api/v1/grades/${id}/`, method: 'PATCH' }),
    DELETE: (id: string) => ({ url: `/api/v1/grades/${id}/`, method: 'DELETE' }),
  },

  SECTIONS: {
    LIST: () => ({ url: '/api/v1/sections/', method: 'GET' }),
  },

  // Student endpoints
  STUDENT: {
    LIST: '/api/v1/students/',
    CREATE: '/api/v1/students/',
    UPDATE_BY_ID: '/api/v1/students/',
    DELETE_BY_ID: '/api/v1/students/',
    DETAILS_BY_ID: '/api/v1/students/',
    MINIMAL_LIST: (params?: Record<string, unknown>) => ({
      url: `/api/v1/students/minimal_list/`,
      method: 'GET',
      params,
    }),
  },

  // Exam Types endpoints
  EXAM_TYPES: {
    LIST: '/api/v1/exam-types/',
    CREATE: '/api/v1/exam-types/',
    UPDATE_BY_ID: '/api/v1/exam-types/',
    DELETE_BY_ID: '/api/v1/exam-types/',
    DETAILS_BY_ID: '/api/v1/exam-types/',
  },

  EXAMS: {
    LIST: '/api/v1/exams/',
    LIST_WP: () => ({ url: '/api/v1/exams/', method: 'GET' }),
    CREATE: '/api/v1/exams/',
    UPDATE_BY_ID: '/api/v1/exams/',
    DELETE_BY_ID: '/api/v1/exams/',
    DETAILS_BY_ID: '/api/v1/exams/',
    SUBJECTS_BY_ID: (id: string) => ({ url: `/api/v1/exams/${id}/subjects/`, method: 'GET' }),
  },

  // Exam Mark endpoints
  EXAM_RESULTS: {
    LIST: (params?: Record<string, unknown>) => ({
      url: `/api/v1/exam-results/`,
      method: 'GET',
      params,
    }),
    CREATE: () => ({ url: '/api/v1/exam-results/', method: 'POST' }),
    DETAILS: (id: string) => ({ url: `/api/v1/exam-results/${id}/`, method: 'GET' }),
    UPDATE: (id: string) => ({ url: `/api/v1/exam-results/${id}/`, method: 'PUT' }),
    PARTIAL_UPDATE: (id: string) => ({ url: `/api/v1/exam-results/${id}/`, method: 'PATCH' }),
    DELETE: (id: string) => ({ url: `/api/v1/exam-results/${id}/`, method: 'DELETE' }),
    BULK_CREATE: () => ({ url: '/api/v1/exam-results/bulk/', method: 'POST' }),
  },
};
