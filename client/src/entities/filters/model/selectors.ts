import { CategoryId } from '@/src/shared/config';
import { RootState } from '@/src/shared/store/redux-store';
import { FiltersMap } from './types';

export const selectOpenDrawerCategory = (state: RootState) =>
  state.filters.openDrawerCategory;

export const selectSelectedFiltersByCategory =
  (categoryId: CategoryId) =>
  (state: RootState): FiltersMap =>
    state.filters.selectedFilters[categoryId] || {};

export const selectAllSelectedFilters = (
  state: RootState,
): Partial<Record<CategoryId, FiltersMap>> => state.filters.selectedFilters;
