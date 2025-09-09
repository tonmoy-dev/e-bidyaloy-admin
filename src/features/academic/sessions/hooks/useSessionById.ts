import { useGetSessionByIdQuery } from "../api/sessionApi";

export const useSessionById = (id: number | null) => {
  const skip = !id || id < 0;

  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetSessionByIdQuery(id!, { skip });
  return { isLoading, isFetching, sessionDetails: data, isError, error, refetch };
};
