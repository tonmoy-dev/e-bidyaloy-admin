import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
import type { PaginatedResponse, TeacherModel } from '../models/teacher.model';

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

    getTeacherById: builder.query<TeacherModel, number>({
      query: (id) => `${API_ENDPOINTS.TEACHER.DETAILS_BY_ID}${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Teacher', id }],
    }),

    createTeacher: builder.mutation<TeacherModel, Partial<TeacherModel>>({
      query: (newTeacher) => ({
        url: API_ENDPOINTS.TEACHER.CREATE,
        method: 'POST',
        body: newTeacher,
      }),
      invalidatesTags: [{ type: 'Teacher', id: 'LIST' }],
    }),

    updateTeacher: builder.mutation<TeacherModel, { id: number; data: Partial<TeacherModel> }>({
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

    deleteTeacher: builder.mutation<void, number>({
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
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
