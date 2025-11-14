
import { useGetExamResultByIdQuery } from '../api/examResultApi';

export const useExamResultById = (id: string | null, skipQuery: boolean = false) => {
  const skip = !id || skipQuery;

  const { isLoading, isFetching, data, isError, error, refetch } = useGetExamResultByIdQuery(id!, {
    skip,
  });

  return {
    isLoading,
    isFetching,
    examResultDetails: data,
    isError,
    error,
    refetch,
  };
};
