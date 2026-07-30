import { CategoryId } from '@/src/shared/config';
import { queryOptions } from '@tanstack/react-query';
import { filtersApi } from './filters.api';
import { filtersQueryKey } from './filters.keys';

export const getFiltersQuery = (categoryId: CategoryId) =>
  queryOptions({
    queryKey: filtersQueryKey(categoryId),
    queryFn: () => filtersApi.getFilters(categoryId),
    staleTime: 1000 * 60 * 5,
  });
