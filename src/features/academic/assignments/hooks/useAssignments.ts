import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../core/store';
import { useGetAssignmentsQuery } from "../api/assignmentApi";

export const useAssignments = (page?: number) => {
  // Get logged-in user from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  const { isLoading, isFetching, data, isError, error, refetch } = useGetAssignmentsQuery(page);

  // Filter assignments by student's class_id and section_id
  const filteredAssignments = useMemo(() => {
    if (!data || !user?.class_id || !user?.section_id) {
      return data;
    }

    return {
      ...data,
      results: data.results.filter(
        (assignment) =>
          assignment.class_assigned === user.class_id &&
          assignment.section === user.section_id
      ),
    };
  }, [data, user?.class_id, user?.section_id]);

  return {
    assignments: filteredAssignments,
    isAssignmentsLoading: isLoading,
    isAssignmentsFetching: isFetching,
    isAssignmentsError: isError,
    assignmentsError: error,
    refetchAssignments: refetch,
  };
};