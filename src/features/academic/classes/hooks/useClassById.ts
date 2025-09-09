import { useGetClassByIdQuery } from "../api/classApi";

export const useClassById = (id: number | null) => {
  const skip = !id || id < 0;

  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetClassByIdQuery(id!, { skip });
  return { isLoading, isFetching, classDetails: data, isError, error, refetch };
};
