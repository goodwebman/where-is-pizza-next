'use client';

import {
  CATEGORIES,
  CategoryId,
  EMPTY_FILTERS,
  FiltersMap,
} from '@/src/entities/filters/model/types';
import { productsApi } from '@/src/entities/product/api/product-api';
import { useQueries } from '@tanstack/react-query';

import { Product } from '@/src/entities/product/model/types';
import { QUERY_KEYS } from '@/src/shared/api';

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
    queries: CATEGORIES.map(categoryId => ({
      queryKey: [
        QUERY_KEYS.PRODUCTS,
        categoryId,
        selectedFiltersMap[categoryId] ?? EMPTY_FILTERS,
      ],
      queryFn: () =>
        productsApi.getProducts(
          categoryId,
          selectedFiltersMap[categoryId] ?? EMPTY_FILTERS,
        ),
      staleTime: 1000 * 60 * 5,
    })),
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
