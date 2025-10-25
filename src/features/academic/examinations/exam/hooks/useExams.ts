import { useGetExamsQuery } from "../api/examApi";

export const useExams = (page?: number) => {
  const { isLoading, isFetching, data, isError, error, refetch, } = useGetExamsQuery(page);

  return {
    exams: data,
    isExamsLoading: isLoading,
    isExamsFetching: isFetching,
    isExamsError: isError,
    examsError: error,
    refetchExams: refetch,
  };
};