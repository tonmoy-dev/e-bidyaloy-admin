import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';

export interface Complaint {
  id: string;
  complaint_type: string;
  subject: string;
  description: string;
  attachment?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  complainant: string;
  complainant_name?: string;
  complainant_email?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  resolved_by?: string;
  resolved_by_name?: string;
  resolved_at?: string;
  response_message?: string;
  organization?: string;
  organization_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const complaintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplaints: builder.query<PaginatedResponse<Complaint>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.COMPLAINTS.LIST().url}?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Complaint' as const,
                id,
              })),
              { type: 'Complaint', id: 'LIST' },
            ]
          : [{ type: 'Complaint', id: 'LIST' }],
    }),

    getComplaintById: builder.query<Complaint, string>({
      query: (id) => `${API_ENDPOINTS.COMPLAINTS.DETAILS(id).url}`,
      providesTags: (_result, _error, id) => [{ type: 'Complaint', id }],
    }),

    createComplaint: builder.mutation<Complaint, FormData | Partial<Complaint>>({
      query: (newComplaint) => ({
        url: API_ENDPOINTS.COMPLAINTS.CREATE().url,
        method: 'POST',
        body: newComplaint,
        headers: newComplaint instanceof FormData ? { 'skip-content-type': 'true' } : undefined,
      }),
      invalidatesTags: [{ type: 'Complaint', id: 'LIST' }],
    }),

    updateComplaint: builder.mutation<
      Complaint,
      { id: string; data: FormData | Partial<Complaint> }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.COMPLAINTS.PARTIAL_UPDATE(id).url,
        method: 'PATCH',
        body: data,
        headers: data instanceof FormData ? { 'skip-content-type': 'true' } : undefined,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Complaint', id },
        { type: 'Complaint', id: 'LIST' },
      ],
    }),

    deleteComplaint: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.COMPLAINTS.DELETE(id).url,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Complaint', id },
        { type: 'Complaint', id: 'LIST' },
      ],
    }),

    markComplaintResolved: builder.mutation<Complaint, { id: string; response_message?: string }>({
      query: ({ id, response_message }) => ({
        url: API_ENDPOINTS.COMPLAINTS.MARK_RESOLVED(id).url,
        method: 'POST',
        body: response_message ? { response_message } : undefined,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Complaint', id },
        { type: 'Complaint', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useCreateComplaintMutation,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
  useMarkComplaintResolvedMutation,
} = complaintApi;
