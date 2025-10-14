import { useGetGradeByIdQuery } from '../api/gradeApi';

export const useGradeById = (id: string | null, skipQuery: boolean = false) => {
  const skip = !id || skipQuery;

  const { isLoading, isFetching, data, isError, error, refetch } = useGetGradeByIdQuery(id!, {
    skip,
  });

  return {
    isLoading,
    isFetching,
    gradeDetails: data,
    isError,
    error,
    refetch,
  };
};
