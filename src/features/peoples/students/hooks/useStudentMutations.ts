import {
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
}
from '../api/studentApi';

export const useStudentMutations = () => {
    const [createStudent, createState] = useCreateStudentMutation();
    const [updateStudent, updateState] = useUpdateStudentMutation();
    const [deleteStudent, deleteState] = useDeleteStudentMutation();

    return {
        createStudent,
        updateStudent,
        deleteStudent,
      
        isCreating: createState.isLoading,
        isCreateSuccess: createState.isSuccess,
        createError: createState.error, 

        isUpdating: updateState.isLoading,
        isUpdateSuccess: updateState.isSuccess,
        updateError: updateState.error,

        isDeleting: deleteState.isLoading,
        isDeleteSuccess: deleteState.isSuccess,
        deleteError: deleteState.error,
    };
};