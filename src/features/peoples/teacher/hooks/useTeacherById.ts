import { useGetTeacherByIdQuery } from '../api/teacherApi';

export const useTeacherById = (id: number | null) => {
  const skip = !id || id < 0;

  const { isLoading, isFetching, data, isError, error, refetch } = useGetTeacherByIdQuery(id!, {
    skip,
  });
  return { isLoading, isFetching, teacherDetails: data, isError, error, refetch };
};
