import {
  useCreateExamTypeMutation,
  useDeleteExamTypeMutation,
  useUpdateExamTypeMutation,
} from "../api/examTypeApi";

export const useExamTypeMutations = () => {
  const [createExamType, createState] = useCreateExamTypeMutation();
  const [updateExamType, updateState] = useUpdateExamTypeMutation();
  const [deleteExamType, deleteState] = useDeleteExamTypeMutation();

  return {
    // 🔹 Mutations
    createExamType,
    updateExamType,
    deleteExamType,

    // 🔹 Create states
    isCreating: createState.isLoading,
    isCreateSuccess: createState.isSuccess,
    createError: createState.error,

    // 🔹 Update states
    isUpdating: updateState.isLoading,
    isUpdateSuccess: updateState.isSuccess,
    updateError: updateState.error,

    // 🔹 Delete states
    isDeleting: deleteState.isLoading,
    isDeleteSuccess: deleteState.isSuccess,
    deleteError: deleteState.error,
  };
};