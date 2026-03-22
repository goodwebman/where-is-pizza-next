'use client';

import { FC, useMemo } from 'react';

import {
  selectAllSelectedFilters,
  selectOpenDrawerCategory,
} from '@/src/entities/filters/model/selectors';

import { openFiltersDrawer } from '@/src/entities/filters/model/slice';
import { EMPTY_FILTERS, FiltersMap } from '@/src/entities/filters/model/types';

import { useFiltersQuery } from '@/src/entities/filters/hooks/use-filters-query';
import { ProductDetails } from '@/src/entities/product/model/types';
import { openProductCardModal } from '@/src/features/product';
import { ProductAddToCartModal } from '@/src/features/product/product-add-to-cart-modal/ui/product-add-to-cart-modal';
import { ProductFiltersDrawer } from '@/src/features/product/product-filters-drawer/ui/product-filters-drawer';
import { CATEGORIES, CategoryId } from '@/src/shared/config';
import { getCategoryLabel } from '@/src/shared/config/categories/categories';
import { getCategorySectionId } from '@/src/shared/lib';
import { useAppDispatch, useAppSelector } from '@/src/shared/store/redux-store';
import { getFiltersForCategory } from '../model/get-filters-for-category';
import { useCategoryProducts } from '../model/use-category-products';
import { ProductCategorySection } from '../ui/product-category-section';

export const ProductCategoryContainer: FC = () => {
  const dispatch = useAppDispatch();

  const openDrawerCategory = useAppSelector(selectOpenDrawerCategory);

  const selectedFiltersMap = useAppSelector(selectAllSelectedFilters);

  const productsMap = useCategoryProducts(selectedFiltersMap);

  const filtersQueries = CATEGORIES.map(categoryId =>
    useFiltersQuery(categoryId),
  );

  const allFilters: Partial<Record<CategoryId, FiltersMap>> = useMemo(() => {
    return CATEGORIES.reduce((acc, categoryId, index) => {
      acc[categoryId] = filtersQueries[index].data;
      return acc;
    }, {} as Partial<Record<CategoryId, FiltersMap>>);
  }, [filtersQueries]);

  const handleOpenFilters = (categoryId: CategoryId) => {
    dispatch(openFiltersDrawer(categoryId));
  };

  const handleOpenProductCardModal = (product: ProductDetails) => {
    dispatch(openProductCardModal(product));
  };

  return (
    <>
      {CATEGORIES.map(categoryId => {
        const filters = getFiltersForCategory(categoryId, allFilters);

        const productsState = productsMap[categoryId];

        return (
          <ProductCategorySection
            key={categoryId}
            id={getCategorySectionId(categoryId)}
            categoryId={categoryId}
            label={getCategoryLabel(categoryId)}
            products={productsState.products}
            isLoading={productsState.isLoading}
            isError={productsState.isError}
            filters={filters}
            onOpenFilters={handleOpenFilters}
            onProductClick={handleOpenProductCardModal}
          />
        );
      })}

      <ProductAddToCartModal />

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
