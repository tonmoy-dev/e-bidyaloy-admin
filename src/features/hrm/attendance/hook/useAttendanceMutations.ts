// useAttendanceMutations.ts
import { useBulkMarkAttendanceMutation } from '../api/attendanceApi';

export const useAttendanceMutations = () => {
  const [bulkMarkAttendance, bulkMarkState] = useBulkMarkAttendanceMutation();

  return {
    bulkMarkAttendance,

    // Bulk mark states
    isMarking: bulkMarkState.isLoading,
    isMarkSuccess: bulkMarkState.isSuccess,
    markError: bulkMarkState.error,
    markData: bulkMarkState.data,
  };
};
