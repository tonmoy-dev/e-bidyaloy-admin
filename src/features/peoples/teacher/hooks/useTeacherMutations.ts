import {
  useCreateTeacherMutation,
  useDeleteTeacherMutation,
  usePartialUpdateTeacherMutation,
  useUpdateTeacherMutation,
} from '../api/teacherApi';

export const useTeacherMutations = () => {
  const [createTeacher, createState] = useCreateTeacherMutation();
  const [updateTeacher, updateState] = useUpdateTeacherMutation();
  const [partialUpdateTeacher, partialUpdateState] = usePartialUpdateTeacherMutation();
  const [deleteTeacher, deleteState] = useDeleteTeacherMutation();

  return {
    // 🔹 Mutations
    createTeacher,
    updateTeacher,
    partialUpdateTeacher,
    deleteTeacher,

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
