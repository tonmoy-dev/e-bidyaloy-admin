import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';

export interface Application {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  applicant_name?: string;
  applicant_email?: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query<PaginatedResponse<Application>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.APPLICATIONS.LIST().url}?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Application' as const,
                id,
              })),
              { type: 'Application', id: 'LIST' },
            ]
          : [{ type: 'Application', id: 'LIST' }],
    }),

    getApplicationById: builder.query<Application, string>({
      query: (id) => `${API_ENDPOINTS.APPLICATIONS.DETAILS(id).url}`,
      providesTags: (_result, _error, id) => [{ type: 'Application', id }],
    }),

    createApplication: builder.mutation<Application, FormData | Partial<Application>>({
      query: (newApplication) => ({
        url: API_ENDPOINTS.APPLICATIONS.CREATE().url,
        method: 'POST',
        body: newApplication,
        headers: newApplication instanceof FormData ? { 'skip-content-type': 'true' } : undefined,
      }),
      invalidatesTags: [{ type: 'Application', id: 'LIST' }],
    }),

    updateApplication: builder.mutation<
      Application,
      { id: string; data: FormData | Partial<Application> }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.APPLICATIONS.PARTIAL_UPDATE(id).url,
        method: 'PATCH',
        body: data,
        headers: data instanceof FormData ? { 'skip-content-type': 'true' } : undefined,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Application', id },
        { type: 'Application', id: 'LIST' },
      ],
    }),

    deleteApplication: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.APPLICATIONS.DELETE(id).url,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Application', id },
        { type: 'Application', id: 'LIST' },
      ],
    }),

    approveApplication: builder.mutation<Application, string>({
      query: (id) => ({
        url: API_ENDPOINTS.APPLICATIONS.APPROVE(id).url,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Application', id },
        { type: 'Application', id: 'LIST' },
      ],
    }),

    rejectApplication: builder.mutation<Application, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: API_ENDPOINTS.APPLICATIONS.REJECT(id).url,
        method: 'POST',
        body: reason ? { reason } : undefined,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Application', id },
        { type: 'Application', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
} = applicationApi;
