import { useCreateExamMutation, useUpdateExamMutation, useDeleteExamMutation } from "../api/examApi";
import type { CreateExamRequest } from "../models/exam.model";

export const useExamMutations = () => {
  const [createExamMutation] = useCreateExamMutation();
  const [updateExamMutation] = useUpdateExamMutation();
  const [deleteExamMutation] = useDeleteExamMutation();

  const createExam = async (data: CreateExamRequest) => {
    try {
  // DEBUG: log payload being sent to backend to help diagnose PK validation issues
  // (temporary - remove once debugging is complete)
  console.log('DEBUG createExam payload:', JSON.stringify(data, null, 2));
      const response = await createExamMutation(data).unwrap();
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateExam = async (payload: { id: string; data: Partial<CreateExamRequest> }) => {
    try {
  // DEBUG: log payload being sent to backend when updating
  console.log('DEBUG updateExam payload:', payload);
      const response = await updateExamMutation(payload).unwrap();
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteExam = async (id: string) => {
    try {
      const response = await deleteExamMutation(id).unwrap();
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    createExam,
    updateExam,
    deleteExam,
  };
};