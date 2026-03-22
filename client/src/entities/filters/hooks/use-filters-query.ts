// entities/filters/hooks/use-filters-query.ts

'use client';

import { useQuery } from '@tanstack/react-query';

import { CategoryId } from '@/src/shared/config';
import { getFiltersQuery } from '../api/filters.queries';

export const useFiltersQuery = (categoryId: CategoryId) => {
  return useQuery(getFiltersQuery(categoryId));
};
