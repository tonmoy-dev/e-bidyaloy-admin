import { useGetClassByIdQuery } from "../api/classApi";

export const useClassById = (id: string | null, skipQuery: boolean = false) => {
  const skip = !id || skipQuery;

  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetClassByIdQuery(id!, { skip });
  return { isLoading, isFetching, classDetails: data, isError, error, refetch };
};
