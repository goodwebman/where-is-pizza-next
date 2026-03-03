
'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/src/entities/product/api/product.api';
import { CategoryId } from '@/src/shared/config';
import { Product } from '@/src/entities/product/model/types';
import { QUERY_KEYS } from '@/src/shared/api'

export const useUpsellProducts = (categoryId: CategoryId) => {
  return useQuery<Product[]>({
    queryKey: [QUERY_KEYS.UPSELL_PRODUCTS, categoryId],
    queryFn: () => productsApi.getProducts(categoryId),
    staleTime: 1000 * 60 * 10,
  });
};