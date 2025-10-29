import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
import type { PaginatedResponse } from '../models/common.model';
import type { TeacherModel } from '../models/teacher.model';

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated teachers list
    getTeachers: builder.query<PaginatedResponse<TeacherModel>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.TEACHER.LIST}?page=${page}`,
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'Teacher' as const, id })),
            { type: 'Teacher', id: 'LIST' },
          ]
          : [{ type: 'Teacher', id: 'LIST' }],
    }),

    // get teachers without pagination
    getTeachersWithoutPagination: builder.query<TeacherModel[], void>({
      query: () => API_ENDPOINTS.TEACHER.LIST_WP,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Teacher' as const, id })),
            { type: 'Teacher', id: 'LIST_WP' },
          ]
          : [{ type: 'Teacher', id: 'LIST_WP' }],
    }),

    // Get single teacher by ID
    getTeacherById: builder.query<TeacherModel, string>({
      query: (id) => `${API_ENDPOINTS.TEACHER.DETAILS_BY_ID}${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Teacher', id }],
    }),

    // Create new teacher
    createTeacher: builder.mutation<TeacherModel, Partial<TeacherModel>>({
      query: (newTeacher) => ({
        url: API_ENDPOINTS.TEACHER.CREATE,
        method: 'POST',
        body: newTeacher,
      }),
      invalidatesTags: [{ type: 'Teacher', id: 'LIST' }],
    }),

    // Update full teacher
    updateTeacher: builder.mutation<TeacherModel, { id: string; data: Partial<TeacherModel> }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.TEACHER.UPDATE_BY_ID}${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Teacher', id },
        { type: 'Teacher', id: 'LIST' },
      ],
    }),

    // Partially update teacher
    partialUpdateTeacher: builder.mutation<
      TeacherModel,
      { id: string; data: Partial<TeacherModel> }
    >({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.TEACHER.UPDATE_BY_ID}${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Teacher', id },
        { type: 'Teacher', id: 'LIST' },
      ],
    }),

    // Delete teacher
    deleteTeacher: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.TEACHER.DELETE_BY_ID}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Teacher', id },
        { type: 'Teacher', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeachersQuery,
  useGetTeachersWithoutPaginationQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  usePartialUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
