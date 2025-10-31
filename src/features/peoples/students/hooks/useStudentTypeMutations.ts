import { useState } from 'react';
import {
  useCreateStudentTypeMutation,
  useDeleteStudentTypeMutation,
  useUpdateStudentTypeMutation,
} from '../api/studentTypeApi';
import type { StudentTypeFormData } from '../models/studentType.model';

export const useStudentTypeMutations = () => {
  const [createStudentType, { isLoading: isCreating }] = useCreateStudentTypeMutation();
  const [updateStudentType, { isLoading: isUpdating }] = useUpdateStudentTypeMutation();
  const [deleteStudentType, { isLoading: isDeleting }] = useDeleteStudentTypeMutation();

  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: StudentTypeFormData) => {
    try {
      setError(null);
      await createStudentType(data).unwrap();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to create student type';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleUpdate = async (id: string, data: StudentTypeFormData) => {
    try {
      setError(null);
      await updateStudentType({ id, data }).unwrap();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to update student type';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteStudentType(id).unwrap();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to delete student type';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating,
    isUpdating,
    isDeleting,
    isMutating: isCreating || isUpdating || isDeleting,
    error,
    clearError: () => setError(null),
  };
};
