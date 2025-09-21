import { useGetTeachersQuery } from '../api/teacherApi';

export const useTeachers = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetTeachersQuery(page);
  return { isLoading, isFetching, teachers: data, isError, error, refetch };
};
