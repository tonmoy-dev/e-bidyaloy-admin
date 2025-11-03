import {
  useApproveApplicationMutation,
  useCreateApplicationMutation,
  useDeleteApplicationMutation,
  useRejectApplicationMutation,
  useUpdateApplicationMutation,
} from '../api/applicationApi';

export const useApplicationMutations = () => {
  const [createApplication, { isLoading: isCreating, error: createError }] =
    useCreateApplicationMutation();
  const [updateApplication, { isLoading: isUpdating, error: updateError }] =
    useUpdateApplicationMutation();
  const [deleteApplication, { isLoading: isDeleting, error: deleteError }] =
    useDeleteApplicationMutation();
  const [approveApplication, { isLoading: isApproving, error: approveError }] =
    useApproveApplicationMutation();
  const [rejectApplication, { isLoading: isRejecting, error: rejectError }] =
    useRejectApplicationMutation();

  return {
    createApplication,
    updateApplication,
    deleteApplication,
    approveApplication,
    rejectApplication,
    isLoading: isCreating || isUpdating || isDeleting || isApproving || isRejecting,
    error: createError || updateError || deleteError || approveError || rejectError,
  };
};
