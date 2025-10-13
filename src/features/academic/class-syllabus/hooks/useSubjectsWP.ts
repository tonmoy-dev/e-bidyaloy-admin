import { useGetSubjectsWithoutPaginationQuery } from '../api/syllabusApi';

export const useSubjectsWithoutPagination = () => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetSubjectsWithoutPaginationQuery();

  return {
    isLoading,
    isFetching,
    subjects: data,
    isError,
    error,
    refetch,
  };
};
