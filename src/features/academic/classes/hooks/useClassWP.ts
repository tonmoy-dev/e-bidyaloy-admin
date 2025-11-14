import { useGetClassesWithoutPaginationQuery } from "../api/classApi";


export const useClassesWithoutPagination = () => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetClassesWithoutPaginationQuery();
  return {
    isLoading,
    isFetching,
    classes: data,
    isError,
    error,
    refetch,
  };
};
