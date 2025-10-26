import { useGetAssignmentsQuery } from "../api/assignmentApi";

export const useAssignments = (page?: number) => {
  const { isLoading, isFetching, data, isError, error, refetch, } = useGetAssignmentsQuery(page);

  return {
    assignments: data,
    isAssignmentsLoading: isLoading,
    isAssignmentsFetching: isFetching,
    isAssignmentsError: isError,
    assignmentsError: error,
    refetchAssignments: refetch,
  };
};