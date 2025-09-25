import {
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  usePartialUpdateSubjectMutation,
  useUpdateSubjectMutation,
} from '../api/subjectApi';

export const useSubjectMutations = () => {
  const [createSubject, createState] = useCreateSubjectMutation();
  const [updateSubject, updateState] = useUpdateSubjectMutation();
  const [partialUpdateSubject, partialUpdateState] = usePartialUpdateSubjectMutation();
  const [deleteSubject, deleteState] = useDeleteSubjectMutation();

  return {
    // 🔹 Mutations
    createSubject,
    updateSubject,
    partialUpdateSubject,
    deleteSubject,

    // 🔹 Create states
    isCreating: createState.isLoading,
    isCreateSuccess: createState.isSuccess,
    createError: createState.error,

    // 🔹 Update states
    isUpdating: updateState.isLoading,
    isUpdateSuccess: updateState.isSuccess,
    updateError: updateState.error,

    // 🔹 Partial Update states
    isPartialUpdating: partialUpdateState.isLoading,
    isPartialUpdateSuccess: partialUpdateState.isSuccess,
    partialUpdateError: partialUpdateState.error,

    // 🔹 Delete states
    isDeleting: deleteState.isLoading,
    isDeleteSuccess: deleteState.isSuccess,
    deleteError: deleteState.error,
  };
};
