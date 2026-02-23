'use client';

import {
  usePizzaFiltersQuery,
  useSushiFiltersQuery,
} from '@/src/entities/filters/hooks/use-filters-query';
import {
  selectOpenDrawerCategory,
  selectSelectedFiltersByCategory,
} from '@/src/entities/filters/model/selectors';
import { openFiltersDrawer } from '@/src/entities/filters/model/slice';
import {
  CATEGORIES,
  CATEGORY_NAMES,
  CategoryId,
  EMPTY_FILTERS,
  FiltersMap,
} from '@/src/entities/filters/model/types';
import { getCategoryLabel } from '@/src/entities/product/model/category-label';
import { ProductFiltersDrawer } from '@/src/features/product/product-filters-drawer/ui/product-filters-drawer';
import { useAppDispatch, useAppSelector } from '@/src/shared/store/redux-store';
import { FC } from 'react';
import { getFiltersForCategory } from '../model/get-filters-for-category';
import { useCategoryProducts } from '../model/use-category-products';
import { ProductCategorySection } from '../ui/product-category-section';

export const ProductCategoryContainer: FC = () => {
  const dispatch = useAppDispatch();
  const openDrawerCategory = useAppSelector(selectOpenDrawerCategory);

  const pizzaFiltersQuery = usePizzaFiltersQuery();
  const sushiFiltersQuery = useSushiFiltersQuery();

  const allFilters: Partial<Record<CategoryId, FiltersMap>> = {
    pizza: pizzaFiltersQuery.data,
    sushi: sushiFiltersQuery.data,
  };

  const handleOpenFilters = (categoryId: CategoryId) => {
    dispatch(openFiltersDrawer(categoryId));
  };

  const selectedFiltersMap: Partial<Record<CategoryId, FiltersMap>> = {
    pizza: useAppSelector(
      selectSelectedFiltersByCategory(CATEGORY_NAMES.pizza),
    ),
    sushi: useAppSelector(
      selectSelectedFiltersByCategory(CATEGORY_NAMES.sushi),
    ),
  };

  const productsMap = useCategoryProducts(selectedFiltersMap);

  return (
    <>
      {CATEGORIES.map(categoryId => {
        const filters = getFiltersForCategory(categoryId, allFilters);

        return (
          <ProductCategorySection
            key={categoryId}
            categoryId={categoryId}
            label={getCategoryLabel(categoryId)}
            products={productsMap[categoryId].products}
            isLoading={productsMap[categoryId].isLoading}
            isError={productsMap[categoryId].isError}
            filters={filters}
            onOpenFilters={handleOpenFilters}
          />
        );
      })}

      {openDrawerCategory && (
        <ProductFiltersDrawer
          key={openDrawerCategory}
          filters={
            getFiltersForCategory(openDrawerCategory, allFilters) ??
            EMPTY_FILTERS
          }
        />
      )}
    </>
  );
};
