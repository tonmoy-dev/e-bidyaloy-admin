import { useGetPaymentGatewayByIdQuery } from '../api/paymentGatewayApi';

export const usePaymentGateway = (id: string) => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetPaymentGatewayByIdQuery(id);

  return {
    isLoading,
    isFetching,
    paymentGateway: data,
    isError,
    error,
    refetch,
  };
};
