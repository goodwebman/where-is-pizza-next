import { QUERY_KEYS } from '@/src/shared/api';
import { CategoryId } from '@/src/shared/config';
import { queryOptions } from '@tanstack/react-query';
import { filtersApi } from './filters.api';

export const getFiltersQuery = (categoryId: CategoryId) =>
  queryOptions({
    queryKey: [QUERY_KEYS.FILTERS, categoryId],
    queryFn: () => filtersApi.getFilters(categoryId),
    staleTime: 1000 * 60 * 5,
  });
