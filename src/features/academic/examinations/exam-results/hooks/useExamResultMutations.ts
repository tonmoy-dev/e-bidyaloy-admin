
import {
  useCreateExamResultMutation,
  useDeleteExamResultMutation,
  useUpdateExamResultMutation,
  useBulkCreateExamResultMutation,
} from '../api/examResultApi';

export const useExamResultMutations = () => {
  const [createExamResult, createState] = useCreateExamResultMutation();
  const [updateExamResult, updateState] = useUpdateExamResultMutation();
  const [deleteExamResult, deleteState] = useDeleteExamResultMutation();
  const [bulkCreateExamResult, bulkCreateState] = useBulkCreateExamResultMutation();


  return {
    // Mutations
    createExamResult,
    updateExamResult,
    deleteExamResult,
    bulkCreateExamResult,

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

    // Bulk Create states
    isBulkCreating: bulkCreateState.isLoading,
    isBulkCreateSuccess: bulkCreateState.isSuccess,
    bulkCreateError: bulkCreateState.error,
  };
};
