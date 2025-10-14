import { useGetGradesQuery } from '../api/gradeApi';

export const useGradesList = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetGradesQuery(page);

  return {
    isLoading,
    isFetching,
    grades: data,
    isError,
    error,
    refetch,
  };
};
