import { useGetClassByIdQuery } from "../api/classApi";

export const useClassById = (id: number) => {
  const { isLoading, isFetching, data, isError, error, refetch, } = useGetClassByIdQuery(id);
  return { isLoading, isFetching, classDetails: data, isError, error, refetch };
};
