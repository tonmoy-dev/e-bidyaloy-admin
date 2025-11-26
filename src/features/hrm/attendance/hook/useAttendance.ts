// useAttendance.ts
import { useGetStudentListWithAttendanceQuery } from '../api/attendanceApi';

export const useAttendance = (params?: Record<string, unknown>) => {
  const { isLoading, isFetching, data, isError, error, refetch } =
    useGetStudentListWithAttendanceQuery(params);

  return {
    isLoading,
    isFetching,
    students: data || [],
    pagination: {
      count: data?.count || 0,
      next: data?.next || null,
      previous: data?.previous || null,
    },
    isError,
    error,
    refetch,
  };
};
