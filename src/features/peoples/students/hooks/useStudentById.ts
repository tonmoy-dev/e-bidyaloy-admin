import { useGetStudentByIdQuery } from "../api/studentApi";

export const useStudentById = (id: string | null) => {
  const skip = !id || id.trim() === "";     

    const { isLoading, isFetching, data, isError, error, refetch } = useGetStudentByIdQuery(id || '', {
      skip
    }); 

    return { isLoading, isFetching, studentDetails: data, isError, error, refetch };

};

