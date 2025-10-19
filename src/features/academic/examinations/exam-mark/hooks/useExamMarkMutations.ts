import {
  useCreateExamMarkMutation,
  useUpdateExamMarkMutation,
  usePartialUpdateExamMarkMutation,
  useDeleteExamMarkMutation,
  useBulkCreateExamMarksMutation,
} from '../api/examMarkApi';
import type { CreateExamMarkRequest, UpdateExamMarkRequest, BulkExamMarkRequest } from '../models/exam-mark.model';

export const useExamMarkMutations = () => {
  const [createExamMark, { isLoading: isCreating }] = useCreateExamMarkMutation();
  const [updateExamMark, { isLoading: isUpdating }] = useUpdateExamMarkMutation();
  const [partialUpdateExamMark, { isLoading: isPartialUpdating }] = usePartialUpdateExamMarkMutation();
  const [deleteExamMark, { isLoading: isDeleting }] = useDeleteExamMarkMutation();
  const [bulkCreateExamMarks, { isLoading: isBulkCreating }] = useBulkCreateExamMarksMutation();

  const handleCreateExamMark = async (data: CreateExamMarkRequest) => {
    try {
      const result = await createExamMark(data).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleUpdateExamMark = async (id: string, data: UpdateExamMarkRequest) => {
    try {
      const result = await updateExamMark({ id, data }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handlePartialUpdateExamMark = async (id: string, data: Partial<UpdateExamMarkRequest>) => {
    try {
      const result = await partialUpdateExamMark({ id, data }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleDeleteExamMark = async (id: string) => {
    try {
      await deleteExamMark(id).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleBulkCreateExamMarks = async (data: BulkExamMarkRequest) => {
    try {
      const result = await bulkCreateExamMarks(data).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    // Individual mutations
    createExamMark: handleCreateExamMark,
    updateExamMark: handleUpdateExamMark,
    partialUpdateExamMark: handlePartialUpdateExamMark,
    deleteExamMark: handleDeleteExamMark,
    bulkCreateExamMarks: handleBulkCreateExamMarks,
    
    // Loading states
    isCreating,
    isUpdating,
    isPartialUpdating,
    isDeleting,
    isBulkCreating,
    
    // Raw mutations for direct use
    rawCreateExamMark: createExamMark,
    rawUpdateExamMark: updateExamMark,
    rawPartialUpdateExamMark: partialUpdateExamMark,
    rawDeleteExamMark: deleteExamMark,
    rawBulkCreateExamMarks: bulkCreateExamMarks,
  };
};