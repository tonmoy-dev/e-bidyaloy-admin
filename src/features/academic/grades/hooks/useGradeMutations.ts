import {
  useCreateGradeMutation,
  useDeleteGradeMutation,
  usePartialUpdateGradeMutation,
  useUpdateGradeMutation,
} from '../api/gradeApi';

export const useGradeMutations = () => {
  const [createGrade, createState] = useCreateGradeMutation();
  const [updateGrade, updateState] = useUpdateGradeMutation();
  const [partialUpdateGrade, partialUpdateState] = usePartialUpdateGradeMutation();
  const [deleteGrade, deleteState] = useDeleteGradeMutation();

  return {
    // Mutations
    createGrade,
    updateGrade,
    partialUpdateGrade,
    deleteGrade,

    // Create states
    isCreating: createState.isLoading,
    isCreateSuccess: createState.isSuccess,
    createError: createState.error,

    // Update states
    isUpdating: updateState.isLoading,
    isUpdateSuccess: updateState.isSuccess,
    updateError: updateState.error,

    // Partial Update states
    isPartialUpdating: partialUpdateState.isLoading,
    isPartialUpdateSuccess: partialUpdateState.isSuccess,
    partialUpdateError: partialUpdateState.error,

    // Delete states
    isDeleting: deleteState.isLoading,
    isDeleteSuccess: deleteState.isSuccess,
    deleteError: deleteState.error,
  };
};
