'use client';

import { CategoryId } from '@/src/shared/config';
import { useQuery } from '@tanstack/react-query';
import { getFiltersQuery } from '../api/filters.queries';

export const useFiltersQuery = (categoryId: CategoryId) => {
  const { queryKey, queryFn } = getFiltersQuery(categoryId);

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 10,
  });
};
