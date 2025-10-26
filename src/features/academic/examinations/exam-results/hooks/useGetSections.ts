
import { useGetSectionsQuery } from '../api/examResultApi';

export const useGetSections = () => {
  const { data: sections, isLoading, isError, error } = useGetSectionsQuery();

  return {
    sections: sections?.results,
    isLoading,
    isError,
    error,
  };
};
