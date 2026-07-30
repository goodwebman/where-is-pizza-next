import { QUERY_KEYS } from '@/src/shared/api/query-keys';
import type { CategoryId } from '@/src/shared/config';

export const filtersQueryKey = (categoryId: CategoryId) =>
  [QUERY_KEYS.FILTERS, categoryId] as const;
