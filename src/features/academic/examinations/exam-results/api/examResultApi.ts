
import { API_ENDPOINTS } from "../../../../../core/constants/api";
import { baseApi } from "../../../../../core/services/baseApi";
import type { ExamResultModel, PaginatedResponse } from "../models/examResult.model";

export const examResultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassesWithoutPagination: builder.query<PaginatedResponse<any>, void>({
      query: () => API_ENDPOINTS.CLASS.LIST_WP(),
    }),
    getSubjectsWithoutPagination: builder.query<any[], void>({
      query: () => API_ENDPOINTS.SUBJECT.LIST_WP(),
    }),
    getStudentsMinimal: builder.query<PaginatedResponse<any>, any>({
      query: (params) => API_ENDPOINTS.STUDENT.MINIMAL_LIST(params),
    }),
    getSections: builder.query<PaginatedResponse<any>, void>({
      query: () => API_ENDPOINTS.SECTIONS.LIST(),
    }),
    getExams: builder.query<PaginatedResponse<any>, void>({
      query: () => API_ENDPOINTS.EXAMS.LIST_WP(),
    }),
    getExamResults: builder.query<PaginatedResponse<ExamResultModel>, number | void>({
      query: (page = 1) => API_ENDPOINTS.EXAM_RESULTS.LIST({ page }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'ExamResult' as const, id })),
              { type: 'ExamResult', id: 'LIST' },
            ]
          : [{ type: 'ExamResult', id: 'LIST' }],
    }),

    getExamResultById: builder.query<ExamResultModel, string>({
      query: (id) => API_ENDPOINTS.EXAM_RESULTS.DETAILS(id),
      providesTags: (_result, _error, id) => [{ type: 'ExamResult', id }],
    }),

    createExamResult: builder.mutation<ExamResultModel, Partial<ExamResultModel>>({
      query: (newExamResult) => ({
        ...API_ENDPOINTS.EXAM_RESULTS.CREATE(),
        body: newExamResult,
      }),
      invalidatesTags: [{ type: 'ExamResult', id: 'LIST' }],
    }),

    updateExamResult: builder.mutation<ExamResultModel, { id: string; data: Partial<ExamResultModel> }>({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.EXAM_RESULTS.UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExamResult', id },
        { type: 'ExamResult', id: 'LIST' },
      ],
    }),

    deleteExamResult: builder.mutation<void, string>({
      query: (id) => ({
        ...API_ENDPOINTS.EXAM_RESULTS.DELETE(id),
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ExamResult', id },
        { type: 'ExamResult', id: 'LIST' },
      ],
    }),

    bulkCreateExamResult: builder.mutation<ExamResultModel[], Partial<ExamResultModel[]>>({
      query: (newExamResults) => ({
        ...API_ENDPOINTS.EXAM_RESULTS.BULK_CREATE(),
        body: newExamResults,
      }),
      invalidatesTags: [{ type: 'ExamResult', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClassesWithoutPaginationQuery,
  useGetSubjectsWithoutPaginationQuery,
  useGetStudentsMinimalQuery,
  useGetSectionsQuery,
  useGetExamsQuery,
  useGetExamResultsQuery,
  useGetExamResultByIdQuery,
  useCreateExamResultMutation,
  useUpdateExamResultMutation,
  useDeleteExamResultMutation,
  useBulkCreateExamResultMutation,
} = examResultApi;
