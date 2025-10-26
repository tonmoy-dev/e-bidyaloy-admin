import { API_ENDPOINTS } from "../../../../core/constants/api";
import { baseApi } from "../../../../core/services/baseApi";
import type { AssignmentModel, PaginatedResponse, CreateAssignmentRequest } from "../models/assignment.model";

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query<PaginatedResponse<AssignmentModel>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.ASSIGNMENTS.LIST}?page=${page}`,
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'Assignment' as const, id })),
            { type: 'Assignment', id: 'LIST' },
          ]
          : [{ type: 'Assignment', id: 'LIST' }],
    }),

    getAssignmentById: builder.query<AssignmentModel, string>({
      query: (id) => `${API_ENDPOINTS.ASSIGNMENTS.DETAILS_BY_ID}${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Assignment', id }],
    }),

    createAssignment: builder.mutation<AssignmentModel, CreateAssignmentRequest>({
      query: (newAssignment) => ({
        url: API_ENDPOINTS.ASSIGNMENTS.CREATE,
        method: 'POST',
        body: newAssignment,
      }),
      invalidatesTags: [{ type: 'Assignment', id: 'LIST' }],
    }),

    updateAssignment: builder.mutation<AssignmentModel, { id: string; data: Partial<CreateAssignmentRequest> }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.ASSIGNMENTS.UPDATE_BY_ID}${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Assignment', id },
        { type: 'Assignment', id: 'LIST' },
      ],
    }),

    deleteAssignment: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.ASSIGNMENTS.DELETE_BY_ID}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Assignment', id },
        { type: 'Assignment', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentApi;