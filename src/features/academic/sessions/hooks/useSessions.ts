import { useGetSessionsQuery } from "../api/sessionApi";

export const useSessions = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch, } = useGetSessionsQuery(page);
  return { isLoading, isFetching, sessions: data, isError, error, refetch };
};
