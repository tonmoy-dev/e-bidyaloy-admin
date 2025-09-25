import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
import type { PaginatedResponse } from '../models/common.model'; // or wherever it's defined
import type { SubjectModel } from '../models/subject.model';

export const subjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<PaginatedResponse<SubjectModel>, number | void>({
      query: (page = 1) => API_ENDPOINTS.SUBJECT.LIST({ page }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Subject' as const, id })),
              { type: 'Subject', id: 'LIST' },
            ]
          : [{ type: 'Subject', id: 'LIST' }],
    }),

    getSubjectsWithoutPagination: builder.query<SubjectModel[], void>({
      query: () => API_ENDPOINTS.SUBJECT.LIST_WP(),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Subject' as const, id })),
              { type: 'Subject', id: 'LIST_WP' },
            ]
          : [{ type: 'Subject', id: 'LIST_WP' }],
    }),

    getClassesWithoutPagination: builder.query<SubjectModel[], void>({
      query: () => API_ENDPOINTS.CLASS.LIST_WP(),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Class' as const, id })),
              { type: 'Class', id: 'LIST_WP' },
            ]
          : [{ type: 'Class', id: 'LIST_WP' }],
    }),

    getSubjectById: builder.query<SubjectModel, string>({
      query: (id) => API_ENDPOINTS.SUBJECT.DETAILS(id),
      providesTags: (_result, _error, id) => [{ type: 'Subject', id }],
    }),

    createSubject: builder.mutation<SubjectModel, Partial<SubjectModel>>({
      query: (newSubject) => ({
        ...API_ENDPOINTS.SUBJECT.CREATE(),
        body: newSubject,
      }),
      invalidatesTags: [
        { type: 'Subject', id: 'LIST' },
        { type: 'Subject', id: 'LIST_WP' },
      ],
    }),

    updateSubject: builder.mutation<SubjectModel, { id: string; data: Partial<SubjectModel> }>({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.SUBJECT.UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Subject', id },
        { type: 'Subject', id: 'LIST' },
        { type: 'Subject', id: 'LIST_WP' },
      ],
    }),

    partialUpdateSubject: builder.mutation<
      SubjectModel,
      { id: string; data: Partial<SubjectModel> }
    >({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.SUBJECT.PARTIAL_UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Subject', id },
        { type: 'Subject', id: 'LIST' },
        { type: 'Subject', id: 'LIST_WP' },
      ],
    }),

    deleteSubject: builder.mutation<void, string>({
      query: (id) => ({
        ...API_ENDPOINTS.SUBJECT.DELETE(id),
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Subject', id },
        { type: 'Subject', id: 'LIST' },
        { type: 'Subject', id: 'LIST_WP' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSubjectsQuery,
  useGetSubjectsWithoutPaginationQuery,
  useGetClassesWithoutPaginationQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  usePartialUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
