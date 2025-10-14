import { useGetExamTypesQuery } from "../api/examTypeApi";

export const useExamTypes = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetExamTypesQuery(page);
  return { isLoading, isFetching, examTypes: data, isError, error, refetch };
};