import { useGetExamByIdQuery } from "../api/examApi";

export const useExamById = (id: string | null, skipQuery = false) => {
  const {
    data: examDetails,
    isLoading: isExamLoading,
    isError,
    error,
  } = useGetExamByIdQuery(id!, {
    skip: !id || skipQuery,
  });

  return {
    examDetails,
    isExamLoading,
    isError,
    error,
  };
};