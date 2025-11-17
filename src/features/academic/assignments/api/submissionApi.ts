import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
import type { PaginatedResponse } from '../models/assignment.model';
import type {
  AssignmentSubmission,
  CreateSubmissionRequest,
  CreateSubmissionResponse,
} from '../models/submission.model';

export const submissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create submission
    createSubmission: builder.mutation<CreateSubmissionResponse, CreateSubmissionRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.CREATE().url,
        method: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.CREATE().method,
        body: data,
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Get submissions by assignment
    getSubmissionsByAssignment: builder.query<AssignmentSubmission[], string>({
      query: (assignmentId) => {
        const listConfig = API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.LIST({ assignment: assignmentId });
        return {
          url: listConfig.url,
          method: listConfig.method,
          params: listConfig.params,
        };
      },
      transformResponse: (response: PaginatedResponse<AssignmentSubmission>) => response.results,
      providesTags: ['Assignment'],
    }),

    // Get submission by ID
    getSubmissionById: builder.query<AssignmentSubmission, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.DETAILS(id).url,
        method: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.DETAILS(id).method,
      }),
      providesTags: ['Assignment'],
    }),

    // Delete submission
    deleteSubmission: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.DELETE(id).url,
        method: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.DELETE(id).method,
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Update submission (for grading)
    updateSubmission: builder.mutation<
      AssignmentSubmission,
      { id: string; data: Partial<AssignmentSubmission> }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.PARTIAL_UPDATE(id).url,
        method: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.PARTIAL_UPDATE(id).method,
        body: data,
      }),
      invalidatesTags: ['Assignment'],
    }),
  }),
});

export const {
  useCreateSubmissionMutation,
  useGetSubmissionsByAssignmentQuery,
  useGetSubmissionByIdQuery,
  useDeleteSubmissionMutation,
  useUpdateSubmissionMutation,
} = submissionApi;
