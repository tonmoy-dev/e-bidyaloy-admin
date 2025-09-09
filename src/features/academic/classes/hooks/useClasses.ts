import { useGetClassesQuery } from "../api/classApi";

export const useClasses = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch, } = useGetClassesQuery(page);
  return { isLoading, isFetching, classes: data, isError, error, refetch };
};
