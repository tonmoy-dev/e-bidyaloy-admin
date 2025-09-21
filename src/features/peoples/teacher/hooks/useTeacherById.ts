import { useGetTeacherByIdQuery } from '../api/teacherApi';

export const useTeacherById = (id: string | null) => {
  const skip = !id || id.trim() === '';

  const { isLoading, isFetching, data, isError, error, refetch } = useGetTeacherByIdQuery(id!, {
    skip,
  });

  return { isLoading, isFetching, teacherDetails: data, isError, error, refetch };
};
