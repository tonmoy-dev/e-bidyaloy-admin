import { useGetStudentsQuery } from "../api/studentApi";

export const useStudents = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetStudentsQuery(page);
  return { isLoading, isFetching, students: data, isError, error, refetch };
};