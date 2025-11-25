import {
  useCreateComplaintMutation,
  useDeleteComplaintMutation,
  useMarkComplaintResolvedMutation,
  useUpdateComplaintMutation,
} from '../api/complaintApi';

export const useComplaintMutations = () => {
  const [createComplaint, { isLoading: isCreating, error: createError }] =
    useCreateComplaintMutation();
  const [updateComplaint, { isLoading: isUpdating, error: updateError }] =
    useUpdateComplaintMutation();
  const [deleteComplaint, { isLoading: isDeleting, error: deleteError }] =
    useDeleteComplaintMutation();
  const [markComplaintResolved, { isLoading: isResolving, error: resolveError }] =
    useMarkComplaintResolvedMutation();

  return {
    createComplaint,
    updateComplaint,
    deleteComplaint,
    markComplaintResolved,
    isLoading: isCreating || isUpdating || isDeleting || isResolving,
    error: createError || updateError || deleteError || resolveError,
  };
};
