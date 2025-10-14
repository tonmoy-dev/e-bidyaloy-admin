import { API_ENDPOINTS } from '../../../../../core/constants/api';
import { baseApi } from '../../../../../core/services/baseApi';

import type { PaginatedResponse } from '../models/common.model';
import type { GradeModel } from '../models/grade.model';

export const gradeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated grades list
    getGrades: builder.query<PaginatedResponse<GradeModel>, number | void>({
      query: (page = 1) => API_ENDPOINTS.GRADES.LIST({ page }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Grade' as const, id })),
              { type: 'Grade', id: 'LIST' },
            ]
          : [{ type: 'Grade', id: 'LIST' }],
    }),

    // Get single grade by ID
    getGradeById: builder.query<GradeModel, string>({
      query: (id) => API_ENDPOINTS.GRADES.DETAILS(id),
      providesTags: (_result, _error, id) => [{ type: 'Grade', id }],
    }),

    // Create new grade
    createGrade: builder.mutation<GradeModel, Partial<GradeModel>>({
      query: (newGrade) => ({
        ...API_ENDPOINTS.GRADES.CREATE(),
        body: newGrade,
      }),
      invalidatesTags: [{ type: 'Grade', id: 'LIST' }],
    }),

    // Update full grade
    updateGrade: builder.mutation<GradeModel, { id: string; data: Partial<GradeModel> }>({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.GRADES.UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Grade', id },
        { type: 'Grade', id: 'LIST' },
      ],
    }),

    // Partially update grade
    partialUpdateGrade: builder.mutation<GradeModel, { id: string; data: Partial<GradeModel> }>({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.GRADES.PARTIAL_UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Grade', id },
        { type: 'Grade', id: 'LIST' },
      ],
    }),

    // Delete grade
    deleteGrade: builder.mutation<void, string>({
      query: (id) => ({
        ...API_ENDPOINTS.GRADES.DELETE(id),
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Grade', id },
        { type: 'Grade', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGradesQuery,
  useGetGradeByIdQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  usePartialUpdateGradeMutation,
  useDeleteGradeMutation,
} = gradeApi;
