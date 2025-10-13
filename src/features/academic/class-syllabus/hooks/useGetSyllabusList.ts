import { useGetSyllabusQuery } from '../api/syllabusApi';

export const useSyllabusList = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetSyllabusQuery(page);

  return {
    isLoading,
    isFetching,
    syllabuses: data, // plural naming consistent with your subject hook
    isError,
    error,
    refetch,
  };
};
