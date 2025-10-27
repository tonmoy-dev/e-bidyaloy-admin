import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
import type { 
  AssignmentAttachment, 
  AttachmentUploadResponse 
} from '../models/attachment.model';

export const assignmentAttachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all assignment attachments
    getAssignmentAttachments: builder.query<
      { results: AssignmentAttachment[]; count: number },
      { page?: number; assignment_id?: string }
    >({
      query: ({ page = 1, assignment_id }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          ...(assignment_id && { assignment_id }),
        });
        return `${API_ENDPOINTS.ASSIGNMENT_ATTACHMENTS.LIST}?${params.toString()}`;
      },
      providesTags: ['AssignmentAttachment'],
    }),

    // Get single assignment attachment
    getAssignmentAttachment: builder.query<AssignmentAttachment, string>({
      query: (id) => `${API_ENDPOINTS.ASSIGNMENT_ATTACHMENTS.DETAILS_BY_ID}${id}/`,
      providesTags: (result, error, id) => [{ type: 'AssignmentAttachment', id }],
    }),

    // Upload/Create assignment attachment
    uploadAssignmentAttachment: builder.mutation<AttachmentUploadResponse, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.ASSIGNMENT_ATTACHMENTS.CREATE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['AssignmentAttachment'],
    }),

    // Update assignment attachment
    updateAssignmentAttachment: builder.mutation<
      AssignmentAttachment,
      { id: string; data: FormData | Partial<AssignmentAttachment> }
    >({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.ASSIGNMENT_ATTACHMENTS.UPDATE_BY_ID}${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AssignmentAttachment', id }],
    }),

    // Delete assignment attachment
    deleteAssignmentAttachment: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.ASSIGNMENT_ATTACHMENTS.DELETE_BY_ID}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'AssignmentAttachment', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAssignmentAttachmentsQuery,
  useGetAssignmentAttachmentQuery,
  useUploadAssignmentAttachmentMutation,
  useUpdateAssignmentAttachmentMutation,
  useDeleteAssignmentAttachmentMutation,
} = assignmentAttachmentApi;