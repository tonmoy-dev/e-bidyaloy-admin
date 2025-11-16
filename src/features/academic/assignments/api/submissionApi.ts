import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
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
        const endpoint = API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.LIST({ assignment: assignmentId });
        return {
          url: endpoint.url,
          method: endpoint.method,
          params: endpoint.params, // Include params for query string
        };
      },
      // Transform paginated response to extract results array
      transformResponse: (response: { results: AssignmentSubmission[] }) => {
        return response.results || [];
      },
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
  }),
});

export const {
  useCreateSubmissionMutation,
  useGetSubmissionsByAssignmentQuery,
  useGetSubmissionByIdQuery,
} = submissionApi;
