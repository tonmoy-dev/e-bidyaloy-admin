import { useGetPaymentGatewayByIdQuery } from '../api/paymentGatewayApi';

export const usePaymentGatewayById = (id: string | null) => {
  const skip = !id || id.trim() === '';

  const { isLoading, isFetching, data, isError, error, refetch } = useGetPaymentGatewayByIdQuery(
    id || '',
    { skip },
  );

  return {
    isLoading,
    isFetching,
    paymentGatewayDetails: data,
    isError,
    error,
    refetch,
  };
};
