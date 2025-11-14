import { useGetStudentsMinimalQuery } from '../api/examResultApi';

export const useGetStudentsMinimal = (params: any) => {
  const { data: students, isLoading, isError, error, refetch } = useGetStudentsMinimalQuery(params);

  return {
    students,
    isLoading,
    isError,
    error,
    refetch,
  };
};
