import { useGetApplicationByIdQuery } from '../api/applicationApi';

export const useApplicationById = (id: string | null) => {
  const skip = !id || id.trim() === '';

  const { isLoading, isFetching, data, isError, error, refetch } = useGetApplicationByIdQuery(
    id || '',
    { skip },
  );

  return {
    isLoading,
    isFetching,
    applicationDetails: data,
    isError,
    error,
    refetch,
  };
};
