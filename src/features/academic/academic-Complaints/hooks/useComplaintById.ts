import { useGetComplaintByIdQuery } from '../api/complaintApi';

export const useComplaintById = (id: string | null) => {
  const skip = !id || id.trim() === '';

  const { isLoading, isFetching, data, isError, error, refetch } = useGetComplaintByIdQuery(
    id || '',
    { skip },
  );

  return {
    isLoading,
    isFetching,
    complaintDetails: data,
    isError,
    error,
    refetch,
  };
};
