import { FiltersMap } from '@/src/entities/filters/model/types';
import { CategoryId } from '@/src/shared/config';
import { queryOptions } from '@tanstack/react-query';
import { productsApi } from './product.api';
import { productsQueryKey } from './product.keys';

export const getProductsQuery = (categoryId: CategoryId, filters: FiltersMap) =>
  queryOptions({
    queryKey: productsQueryKey(categoryId, filters),
    queryFn: () => productsApi.getProducts(categoryId, filters),
    staleTime: 1000 * 60 * 5,
  });
