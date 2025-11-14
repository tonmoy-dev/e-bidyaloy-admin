import { useCreateAssignmentMutation, useUpdateAssignmentMutation, useDeleteAssignmentMutation } from "../api/assignmentApi";

export const useAssignmentMutations = () => {
  const [createAssignmentMutation] = useCreateAssignmentMutation();
  const [updateAssignmentMutation] = useUpdateAssignmentMutation();
  const [deleteAssignmentMutation] = useDeleteAssignmentMutation();

  return {
    createAssignment: createAssignmentMutation,
    updateAssignment: updateAssignmentMutation,
    deleteAssignment: deleteAssignmentMutation,
  };
};