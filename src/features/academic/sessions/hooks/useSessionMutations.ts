// src/features/sessions/hooks/useSessionMutations.ts
import {
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useUpdateSessionMutation,
} from "../api/sessionApi";

export const useSessionMutations = () => {
  const [createSession, createState] = useCreateSessionMutation();
  const [updateSession, updateState] = useUpdateSessionMutation();
  const [deleteSession, deleteState] = useDeleteSessionMutation();

  return {
    // 🔹 Mutations
    createSession,
    updateSession,
    deleteSession,

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
