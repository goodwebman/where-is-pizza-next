import { useQuery } from '@tanstack/react-query';

import { CategoryId, FiltersMap } from '@/src/entities/filters/model/types';
import { QUERY_KEYS } from '@/src/shared/api';
import { productsApi } from '../api/product-api';

export const useProductsQuery = (
  categoryId: CategoryId,
  filters?: FiltersMap,
) =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, categoryId, filters],
    queryFn: () => {
      return productsApi.getProducts(categoryId, filters);
    },
  });
