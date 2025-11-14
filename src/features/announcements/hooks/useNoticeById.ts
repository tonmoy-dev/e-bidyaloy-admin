import { useGetNoticeByIdQuery } from '../api/noticeApi';

export const useNoticeById = (id: string | null) => {
  const skip = !id || id.trim() === '';

  const { isLoading, isFetching, data, isError, error, refetch } = useGetNoticeByIdQuery(
    id || '',
    { skip },
  );

  return {
    isLoading,
    isFetching,
    noticeDetails: data,
    isError,
    error,
    refetch,
  };
};
