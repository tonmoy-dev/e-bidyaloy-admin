// src/features/classes/hooks/useClassMutations.ts
import {
  useCreateClassMutation,
  useDeleteClassMutation,
  useUpdateClassMutation,
} from "../api/classApi";

export const useClassMutations = () => {
  const [createClass, createState] = useCreateClassMutation();
  const [updateClass, updateState] = useUpdateClassMutation();
  const [deleteClass, deleteState] = useDeleteClassMutation();

  return {
    // 🔹 Mutations
    createClass,
    updateClass,
    deleteClass,

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
