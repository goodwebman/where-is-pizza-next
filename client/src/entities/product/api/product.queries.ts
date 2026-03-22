import { FiltersMap } from '@/src/entities/filters/model/types';
import { QUERY_KEYS } from '@/src/shared/api';
import { CategoryId } from '@/src/shared/config';
import { queryOptions } from '@tanstack/react-query';
import { productsApi } from './product.api';

export const getProductsQuery = (categoryId: CategoryId, filters: FiltersMap) =>
  queryOptions({
    queryKey: [QUERY_KEYS.PRODUCTS, categoryId, filters],
    queryFn: () => productsApi.getProducts(categoryId, filters),
    staleTime: 1000 * 60 * 5,
  });
