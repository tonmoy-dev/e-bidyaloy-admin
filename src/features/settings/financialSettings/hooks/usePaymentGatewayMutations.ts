import {
  useCreatePaymentGatewayMutation,
  useDeletePaymentGatewayMutation,
  useUpdatePaymentGatewayMutation,
} from '../api/paymentGatewayApi';

export const usePaymentGatewayMutations = () => {
  const [createPaymentGateway, createState] = useCreatePaymentGatewayMutation();
  const [updatePaymentGateway, updateState] = useUpdatePaymentGatewayMutation();
  const [deletePaymentGateway, deleteState] = useDeletePaymentGatewayMutation();

  return {
    createPaymentGateway,
    updatePaymentGateway,
    deletePaymentGateway,

    // Create states
    isCreating: createState.isLoading,
    isCreateSuccess: createState.isSuccess,
    createError: createState.error,

    // Update states
    isUpdating: updateState.isLoading,
    isUpdateSuccess: updateState.isSuccess,
    updateError: updateState.error,

    // Delete states
    isDeleting: deleteState.isLoading,
    isDeleteSuccess: deleteState.isSuccess,
    deleteError: deleteState.error,
  };
};
