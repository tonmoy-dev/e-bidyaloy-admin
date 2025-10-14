import { API_ENDPOINTS } from "../../../../../core/constants/api";
import { baseApi } from "../../../../../core/services/baseApi";
import type { ExamTypeModel, PaginatedResponse, CreateExamTypeRequest } from "../models/exam-type.model";

export const examTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExamTypes: builder.query<PaginatedResponse<ExamTypeModel>, number | void>({
      query: (page = 1) => ({
        url: API_ENDPOINTS.EXAM_TYPES.LIST,
        method: 'GET',
        params: { page },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'ExamType' as const, id })),
            { type: 'ExamType', id: 'LIST' },
          ]
          : [{ type: 'ExamType', id: 'LIST' }],
    }),

    getExamTypeById: builder.query<ExamTypeModel, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.EXAM_TYPES.DETAILS_BY_ID}${id}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'ExamType', id }],
    }),

    createExamType: builder.mutation<ExamTypeModel, CreateExamTypeRequest>({
      query: (newExamType) => ({
        url: API_ENDPOINTS.EXAM_TYPES.CREATE,
        method: 'POST',
        body: newExamType,
      }),
      invalidatesTags: [{ type: 'ExamType', id: 'LIST' }],
    }),

    updateExamType: builder.mutation<ExamTypeModel, { id: string; data: Partial<CreateExamTypeRequest> }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.EXAM_TYPES.UPDATE_BY_ID}${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExamType', id },
        { type: 'ExamType', id: 'LIST' },
      ],
    }),

    deleteExamType: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.EXAM_TYPES.DELETE_BY_ID}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ExamType', id },
        { type: 'ExamType', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExamTypesQuery,
  useGetExamTypeByIdQuery,
  useCreateExamTypeMutation,
  useUpdateExamTypeMutation,
  useDeleteExamTypeMutation,
} = examTypeApi;