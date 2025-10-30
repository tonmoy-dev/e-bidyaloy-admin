import { API_ENDPOINTS } from '../../../core/constants/api';
import { baseApi } from '../../../core/services/baseApi';

export interface Notice {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const noticeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotices: builder.query<PaginatedResponse<Notice>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.NOTICES.LIST().url}?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Notice' as const,
                id,
              })),
              { type: 'Notice', id: 'LIST' },
            ]
          : [{ type: 'Notice', id: 'LIST' }],
    }),

    getNoticeById: builder.query<Notice, string>({
      query: (id) => `${API_ENDPOINTS.NOTICES.DETAILS(id).url}`,
      providesTags: (_result, _error, id) => [{ type: 'Notice', id }],
    }),

    createNotice: builder.mutation<Notice, FormData | Partial<Notice>>({
      query: (newNotice) => ({
        url: API_ENDPOINTS.NOTICES.CREATE().url,
        method: 'POST',
        body: newNotice,
        headers: newNotice instanceof FormData ? { 'skip-content-type': 'true' } : undefined,
      }),
      invalidatesTags: [{ type: 'Notice', id: 'LIST' }],
    }),

    updateNotice: builder.mutation<Notice, { id: string; data: FormData | Partial<Notice> }>({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.NOTICES.PARTIAL_UPDATE(id).url,
        method: 'PATCH',
        body: data,
        headers: data instanceof FormData ? { 'skip-content-type': 'true' } : undefined,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Notice', id },
        { type: 'Notice', id: 'LIST' },
      ],
    }),

    deleteNotice: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.NOTICES.DELETE(id).url,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notice', id },
        { type: 'Notice', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNoticesQuery,
  useGetNoticeByIdQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeApi;
