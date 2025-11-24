import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
import type { PaginatedResponse, StudentType } from '../models/studentType.model';

export const studentTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all student types
    getStudentTypes: builder.query<PaginatedResponse<StudentType>, void>({
      query: () => ({
        url: API_ENDPOINTS.STUDENT_TYPES.LIST,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'StudentType' as const, id })),
              { type: 'StudentType', id: 'LIST' },
            ]
          : [{ type: 'StudentType', id: 'LIST' }],
    }),

    // Get student type by ID
    getStudentTypeById: builder.query<StudentType, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.STUDENT_TYPES.DETAILS_BY_ID}${id}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'StudentType', id }],
    }),

    // Create student type
    createStudentType: builder.mutation<StudentType, Partial<StudentType>>({
      query: (data) => ({
        url: API_ENDPOINTS.STUDENT_TYPES.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'StudentType', id: 'LIST' }],
    }),

    // Update student type
    updateStudentType: builder.mutation<StudentType, { id: string; data: Partial<StudentType> }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.STUDENT_TYPES.UPDATE_BY_ID}${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'StudentType', id },
        { type: 'StudentType', id: 'LIST' },
      ],
    }),

    // Delete student type
    deleteStudentType: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.STUDENT_TYPES.DELETE_BY_ID}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'StudentType', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetStudentTypesQuery,
  useGetStudentTypeByIdQuery,
  useCreateStudentTypeMutation,
  useUpdateStudentTypeMutation,
  useDeleteStudentTypeMutation,
} = studentTypeApi;
