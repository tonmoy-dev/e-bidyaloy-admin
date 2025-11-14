
import { useGetExamResultsQuery } from '../api/examResultApi';

export const useExamResultsList = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetExamResultsQuery(page);

  return {
    isLoading,
    isFetching,
    examResults: data,
    isError,
    error,
    refetch,
  };
};
