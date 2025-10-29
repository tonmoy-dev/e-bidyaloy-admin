import { useGetTeachersWithoutPaginationQuery } from "../api/teacherApi";



export const useTeachersWithoutPagination = () => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetTeachersWithoutPaginationQuery();
  return {
    isLoading,
    isFetching,
    classes: data,
    isError,
    error,
    refetch,
  };
};
