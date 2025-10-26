import { useGetAssignmentByIdQuery } from "../api/assignmentApi";

export const useAssignmentById = (id: string | null, skip: boolean = false) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAssignmentByIdQuery(id!, {
    skip: !id || skip,
  });

  return {
    assignmentDetails: data,
    isAssignmentLoading: isLoading,
    isAssignmentFetching: isFetching,
    isError,
    error,
    refetchAssignment: refetch,
  };
};