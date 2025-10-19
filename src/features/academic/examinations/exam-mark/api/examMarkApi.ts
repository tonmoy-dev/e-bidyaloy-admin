import { API_ENDPOINTS } from '../../../../../core/constants/api';
import { baseApi } from '../../../../../core/services/baseApi';
import type { PaginatedResponse } from '../models/common.model';
import type {
  BulkExamMarkRequest,
  CreateExamMarkRequest,
  ExamMarkModel,
  UpdateExamMarkRequest,
} from '../models/exam-mark.model';

export const examMarkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated exam marks list
    getExamMarks: builder.query<PaginatedResponse<ExamMarkModel>, number | void>({
      query: (page = 1) => API_ENDPOINTS.EXAM_MARK.LIST({ page }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'ExamMark' as const, id })),
              { type: 'ExamMark', id: 'LIST' },
            ]
          : [{ type: 'ExamMark', id: 'LIST' }],
    }),

    // Get single exam mark by ID
    getExamMarkById: builder.query<ExamMarkModel, string>({
      query: (id) => API_ENDPOINTS.EXAM_MARK.DETAILS(id),
      providesTags: (_result, _error, id) => [{ type: 'ExamMark', id }],
    }),

    // Create new exam mark
    createExamMark: builder.mutation<ExamMarkModel, CreateExamMarkRequest>({
      query: (newExamMark) => ({
        ...API_ENDPOINTS.EXAM_MARK.CREATE(),
        body: newExamMark,
      }),
      invalidatesTags: [{ type: 'ExamMark', id: 'LIST' }],
    }),

    // Update full exam mark
    updateExamMark: builder.mutation<ExamMarkModel, { id: string; data: UpdateExamMarkRequest }>({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.EXAM_MARK.UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExamMark', id },
        { type: 'ExamMark', id: 'LIST' },
      ],
    }),

    // Partially update exam mark
    partialUpdateExamMark: builder.mutation<
      ExamMarkModel,
      { id: string; data: Partial<UpdateExamMarkRequest> }
    >({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.EXAM_MARK.PARTIAL_UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExamMark', id },
        { type: 'ExamMark', id: 'LIST' },
      ],
    }),

    // Delete exam mark
    deleteExamMark: builder.mutation<void, string>({
      query: (id) => ({
        ...API_ENDPOINTS.EXAM_MARK.DELETE(id),
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ExamMark', id },
        { type: 'ExamMark', id: 'LIST' },
      ],
    }),

    // Bulk create exam marks
    bulkCreateExamMarks: builder.mutation<ExamMarkModel[], BulkExamMarkRequest>({
      query: (bulkData) => ({
        ...API_ENDPOINTS.EXAM_MARK.BULK_CREATE(),
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'ExamMark', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExamMarksQuery,
  useGetExamMarkByIdQuery,
  useCreateExamMarkMutation,
  useUpdateExamMarkMutation,
  usePartialUpdateExamMarkMutation,
  useDeleteExamMarkMutation,
  useBulkCreateExamMarksMutation,
} = examMarkApi;
