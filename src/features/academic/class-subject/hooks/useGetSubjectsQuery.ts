import { useGetSubjectsQuery } from '../api/subjectApi';

export const useSubjects = (page = 1) => {
  const { isLoading, isFetching, data, isError, error, refetch } = useGetSubjectsQuery(page);
  return { isLoading, isFetching, classes: data, isError, error, refetch };
};
