import { useCreateExamMutation, useUpdateExamMutation, useDeleteExamMutation } from "../api/examApi";
import type { CreateExamRequest } from "../models/exam.model";

export const useExamMutations = () => {
  const [createExamMutation] = useCreateExamMutation();
  const [updateExamMutation] = useUpdateExamMutation();
  const [deleteExamMutation] = useDeleteExamMutation();

  const createExam = async (data: CreateExamRequest) => {
    try {
      const response = await createExamMutation(data).unwrap();
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateExam = async (payload: { id: string; data: Partial<CreateExamRequest> }) => {
    try {
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