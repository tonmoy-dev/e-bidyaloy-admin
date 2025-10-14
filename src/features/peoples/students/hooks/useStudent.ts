import { useGetStudentByIdQuery } from "../api/studentApi";

export const useStudent = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetStudentByIdQuery(page);
  return { isLoading, isFetching, student: data, isError, error, refetch };
};