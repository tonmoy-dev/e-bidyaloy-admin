// src/features/teachers/hooks/useTeacherMutations.ts
import {
  useCreateTeacherMutation,
  useDeleteTeacherMutation,
  useUpdateTeacherMutation,
} from '../api/teacherApi';

export const useTeacherMutations = () => {
  const [createTeacher, createState] = useCreateTeacherMutation();
  const [updateTeacher, updateState] = useUpdateTeacherMutation();
  const [deleteTeacher, deleteState] = useDeleteTeacherMutation();

  return {
    // 🔹 Mutations
    createTeacher,
    updateTeacher,
    deleteTeacher,

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
