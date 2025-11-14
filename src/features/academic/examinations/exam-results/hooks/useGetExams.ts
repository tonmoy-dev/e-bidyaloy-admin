
import { useGetExamsQuery } from '../api/examResultApi';

export const useGetExams = () => {
  const { data: exams, isLoading, isError, error } = useGetExamsQuery();

  return {
    exams: exams?.results,
    isLoading,
    isError,
    error,
  };
};
