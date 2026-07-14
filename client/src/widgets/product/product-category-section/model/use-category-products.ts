'use client';

import { EMPTY_FILTERS, FiltersMap } from '@/src/entities/filters/model/types';
import { Product } from '@/src/entities/product';
import { getProductsQuery } from '@/src/entities/product/api/product.queries';
import { CATEGORIES, CategoryId } from '@/src/shared/config';
import { useQueries } from '@tanstack/react-query';

type SelectedFiltersMap = Partial<Record<CategoryId, FiltersMap>>;

type CategoryProductsState = {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
};

export const useCategoryProducts = (
  selectedFiltersMap: SelectedFiltersMap,
): Record<CategoryId, CategoryProductsState> => {
  const queries = useQueries({
    queries: CATEGORIES.map(categoryId => {
      const { queryKey, queryFn } = getProductsQuery(
        categoryId,
        selectedFiltersMap[categoryId] ?? EMPTY_FILTERS
      );

      return {
        queryKey,
        queryFn,
        staleTime: 1000 * 60 * 10,
      };
    }),
  });

  return CATEGORIES.reduce((acc, categoryId, index) => {
    const q = queries[index];

    acc[categoryId] = {
      products: q.data ?? [],
      isLoading: q.isLoading,
      isError: q.isError,
    };

    return acc;
  }, {} as Record<CategoryId, CategoryProductsState>);
};