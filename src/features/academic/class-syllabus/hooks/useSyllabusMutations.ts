import {
  useCreateSyllabusMutation,
  useDeleteSyllabusMutation,
  usePartialUpdateSyllabusMutation,
  useUpdateSyllabusMutation,
} from '../api/syllabusApi';

export const useSyllabusMutations = () => {
  const [createSyllabus, createState] = useCreateSyllabusMutation();
  const [updateSyllabus, updateState] = useUpdateSyllabusMutation();
  const [partialUpdateSyllabus, partialUpdateState] = usePartialUpdateSyllabusMutation();
  const [deleteSyllabus, deleteState] = useDeleteSyllabusMutation();

  return {
    // 🔹 Mutations
    createSyllabus,
    updateSyllabus,
    partialUpdateSyllabus,
    deleteSyllabus,

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
