import { useGetExamTypeByIdQuery } from "../api/examTypeApi";

export const useExamTypeById = (id: string | null, skip = false) => {
  const { isLoading, data, isError, error } = useGetExamTypeByIdQuery(id!, {
    skip: skip || !id,
  });
  
  return { 
    isLoading, 
    examTypeDetails: data, 
    isError, 
    error 
  };
};