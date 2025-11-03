import { useGetApplicationsQuery } from '../api/applicationApi';

export const useApplication = () => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetApplicationsQuery();

  return {
    isLoading,
    isFetching,
    applications: data,
    isError,
    error,
    refetch,
  };
};
