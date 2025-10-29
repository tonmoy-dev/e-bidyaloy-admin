import { useGetSubjectsWithoutPaginationQuery } from "../api/subjectApi";


export const useSubjectsWithoutPagination = () => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetSubjectsWithoutPaginationQuery();
  return {
    isLoading,
    isFetching,
    data,
    isError,
    error,
    refetch,
  };
};
