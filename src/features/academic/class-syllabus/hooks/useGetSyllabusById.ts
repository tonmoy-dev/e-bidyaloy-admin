import { useGetSyllabusByIdQuery } from '../api/syllabusApi';

export const useSyllabusById = (id: string | null, skipQuery: boolean = false) => {
  const skip = !id || skipQuery;

  const { isLoading, isFetching, data, isError, error, refetch } = useGetSyllabusByIdQuery(id!, {
    skip,
  });

  return {
    isLoading,
    isFetching,
    syllabusDetails: data,
    isError,
    error,
    refetch,
  };
};
