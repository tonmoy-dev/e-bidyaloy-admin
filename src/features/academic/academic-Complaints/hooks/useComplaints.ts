import { useGetComplaintsQuery } from '../api/complaintApi';

export const useComplaints = (params?: Record<string, unknown>) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetComplaintsQuery(params);

  return {
    isLoading,
    isFetching,
    complaints: data,
    isError,
    error,
    refetch,
  };
};
