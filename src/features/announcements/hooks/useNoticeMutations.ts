import {
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useUpdateNoticeMutation,
} from '../api/noticeApi';

export const useNoticeMutations = () => {
  const [createNotice, createState] = useCreateNoticeMutation();
  const [updateNotice, updateState] = useUpdateNoticeMutation();
  const [deleteNotice, deleteState] = useDeleteNoticeMutation();

  return {
    createNotice,
    updateNotice,
    deleteNotice,

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
