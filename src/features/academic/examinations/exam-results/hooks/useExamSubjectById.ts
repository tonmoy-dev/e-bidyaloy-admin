import { useGetExamSubjectByIdQuery } from '../api/examResultApi';

export const useExamSubjectById = (id: string | null, skip = false) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetExamSubjectByIdQuery(id!, {
    skip: !id || skip,
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
