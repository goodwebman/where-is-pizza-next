import type { FiltersMap } from '@/src/entities/filters/model/types';
import { QUERY_KEYS } from '@/src/shared/api/query-keys';
import type { CategoryId } from '@/src/shared/config';

/**
 * Split out from product.queries so Server Components can seed the cache
 * without importing the axios client (which is browser-only).
 */
export const productsQueryKey = (categoryId: CategoryId, filters: FiltersMap) =>
  [QUERY_KEYS.PRODUCTS, categoryId, filters] as const;
