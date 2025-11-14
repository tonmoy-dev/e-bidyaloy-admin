import { useGetGradesWithoutPaginationQuery } from '../api/examResultApi';

export const useGetGradesWP = () => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetGradesWithoutPaginationQuery();

  return {
    isLoading,
    isFetching,
    grades: data,
    isError,
    error,
    refetch,
  };
};
