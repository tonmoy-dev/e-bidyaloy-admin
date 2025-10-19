import { API_ENDPOINTS } from '../../../../../core/constants/api';
import { baseApi } from '../../../../../core/services/baseApi';
import type { StudentOption } from '../models/common.model';

export const studentsWPApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentsWithoutPagination: builder.query<StudentOption[], void>({
      query: () => API_ENDPOINTS.STUDENT_LIST_WP.LIST(),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Student' as const, id })),
              { type: 'Student', id: 'LIST_WP' },
            ]
          : [{ type: 'Student', id: 'LIST_WP' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetStudentsWithoutPaginationQuery } = studentsWPApi;

export const useStudentsWithoutPagination = () => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetStudentsWithoutPaginationQuery();

  return {
    isLoading,
    isFetching,
    students: data,
    isError,
    error,
    refetch,
  };
};
