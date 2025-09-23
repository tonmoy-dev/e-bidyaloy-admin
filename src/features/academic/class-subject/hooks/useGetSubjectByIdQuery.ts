import { useGetSubjectByIdQuery } from '../api/subjectApi';

export const useSubjectById = (id: string | null, skipQuery: boolean = false) => {
  const skip = !id || skipQuery;

  const { isLoading, isFetching, data, isError, error, refetch } = useGetSubjectByIdQuery(id!, {
    skip,
  });
  return { isLoading, isFetching, subjectDetails: data, isError, error, refetch };
};
