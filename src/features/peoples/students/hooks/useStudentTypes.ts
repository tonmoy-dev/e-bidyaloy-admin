import { useMemo } from 'react';
import { useGetStudentTypesQuery } from '../api/studentTypeApi';
import type { StudentType } from '../models/studentType.model';

export const useStudentTypes = () => {
  const { data, isLoading, isError, error, refetch } = useGetStudentTypesQuery();

  const studentTypes: StudentType[] = useMemo(() => {
    return data?.results || [];
  }, [data]);

  return {
    studentTypes,
    isLoading,
    isError,
    error,
    refetch,
    totalCount: data?.count || 0,
  };
};
