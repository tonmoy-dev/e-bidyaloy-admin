import { API_ENDPOINTS } from '../../../../../core/constants/api';
import { baseApi } from '../../../../../core/services/baseApi';
import type { ExamOption } from '../models/common.model';

export const examsWPApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExamsWithoutPagination: builder.query<ExamOption[], void>({
      query: () => API_ENDPOINTS.EXAM.LIST_WP(),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Exam' as const, id })),
              { type: 'Exam', id: 'LIST_WP' },
            ]
          : [{ type: 'Exam', id: 'LIST_WP' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetExamsWithoutPaginationQuery } = examsWPApi;

export const useExamsWithoutPagination = () => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetExamsWithoutPaginationQuery();

  return {
    isLoading,
    isFetching,
    exams: data,
    isError,
    error,
    refetch,
  };
};
