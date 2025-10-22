import { API_ENDPOINTS } from "../../../../../core/constants/api";
import { baseApi } from "../../../../../core/services/baseApi";
import type { ExamModel, PaginatedResponse, CreateExamRequest } from "../models/exam.model";

export const examApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<PaginatedResponse<ExamModel>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.EXAMS.LIST}?page=${page}`,
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'Exam' as const, id })),
            { type: 'Exam', id: 'LIST' },
          ]
          : [{ type: 'Exam', id: 'LIST' }],
    }),

    getExamById: builder.query<ExamModel, string>({
      query: (id) => `${API_ENDPOINTS.EXAMS.DETAILS_BY_ID}${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Exam', id }],
    }),

    createExam: builder.mutation<ExamModel, CreateExamRequest>({
      query: (newExam) => ({
        url: API_ENDPOINTS.EXAMS.CREATE,
        method: 'POST',
        body: newExam,
      }),
      invalidatesTags: [{ type: 'Exam', id: 'LIST' }],
    }),

    updateExam: builder.mutation<ExamModel, { id: string; data: Partial<CreateExamRequest> }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.EXAMS.UPDATE_BY_ID}${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Exam', id },
        { type: 'Exam', id: 'LIST' },
      ],
    }),

    deleteExam: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.EXAMS.DELETE_BY_ID}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Exam', id },
        { type: 'Exam', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examApi;