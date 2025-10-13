import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
import type { PaginatedResponse } from '../models/common.model';
import type { SyllabusModel } from '../models/syllabus.model';

export const syllabusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated syllabus list
    getSyllabus: builder.query<PaginatedResponse<SyllabusModel>, number | void>({
      query: (page = 1) => API_ENDPOINTS.SYLLABUS.LIST({ page }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Syllabus' as const, id })),
              { type: 'Syllabus', id: 'LIST' },
            ]
          : [{ type: 'Syllabus', id: 'LIST' }],
    }),

    // Get single syllabus by ID
    getSyllabusById: builder.query<SyllabusModel, string>({
      query: (id) => API_ENDPOINTS.SYLLABUS.DETAILS(id),
      providesTags: (_result, _error, id) => [{ type: 'Syllabus', id }],
    }),

    // Create new syllabus
    createSyllabus: builder.mutation<SyllabusModel, Partial<SyllabusModel>>({
      query: (newSyllabus) => ({
        ...API_ENDPOINTS.SYLLABUS.CREATE(),
        body: newSyllabus,
      }),
      invalidatesTags: [{ type: 'Syllabus', id: 'LIST' }],
    }),

    // Update full syllabus
    updateSyllabus: builder.mutation<SyllabusModel, { id: string; data: Partial<SyllabusModel> }>({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.SYLLABUS.UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Syllabus', id },
        { type: 'Syllabus', id: 'LIST' },
      ],
    }),

    // Partially update syllabus
    partialUpdateSyllabus: builder.mutation<
      SyllabusModel,
      { id: string; data: Partial<SyllabusModel> }
    >({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.SYLLABUS.PARTIAL_UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Syllabus', id },
        { type: 'Syllabus', id: 'LIST' },
      ],
    }),

    // Delete syllabus
    deleteSyllabus: builder.mutation<void, string>({
      query: (id) => ({
        ...API_ENDPOINTS.SYLLABUS.DELETE(id),
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Syllabus', id },
        { type: 'Syllabus', id: 'LIST' },
      ],
    }),

    getSubjectsWithoutPagination: builder.query<SyllabusModel[], void>({
      query: () => API_ENDPOINTS.SUBJECT.LIST_WP(),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Subject' as const, id })),
              { type: 'Subject', id: 'LIST_WP' },
            ]
          : [{ type: 'Subject', id: 'LIST_WP' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSyllabusQuery,
  useGetSyllabusByIdQuery,
  useCreateSyllabusMutation,
  useUpdateSyllabusMutation,
  usePartialUpdateSyllabusMutation,
  useDeleteSyllabusMutation,
  useGetSubjectsWithoutPaginationQuery,
} = syllabusApi;
