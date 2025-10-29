import { useGetPaymentGatewaysQuery } from '../api/paymentGatewayApi';

export const usePaymentGateway = () => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetPaymentGatewaysQuery();

  return {
    isLoading,
    isFetching,
    paymentGateway: data,
    isError,
    error,
    refetch,
  };
};
