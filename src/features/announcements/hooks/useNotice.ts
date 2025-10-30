import { useGetNoticesQuery } from '../api/noticeApi';

export const useNotice = () => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetNoticesQuery();

  return {
    isLoading,
    isFetching,
    notices: data,
    isError,
    error,
    refetch,
  };
};
