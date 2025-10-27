import { useGetExamSubjectByIdQuery } from '../api/examResultApi';

export const useExamSubjectById = (id: string | null, skip = false) => {
  // Add debug logging
  console.log('useExamSubjectById called with:', { id, skip, willSkip: !id || skip });

  const { isLoading, isFetching, data, isError, error, refetch } = useGetExamSubjectByIdQuery(id!, {
    skip: !id || skip,
  });

  // Log the query result
  console.log('useExamSubjectById result:', {
    isLoading,
    isFetching,
    data,
    isError,
    error,
  });

  return {
    isLoading,
    isFetching,
    examSubject: data,
    isError,
    error,
    refetch,
  };
};
