import { RootState } from '@/src/shared/store/redux-store';
import { CategoryId, FiltersMap } from './types';

export const selectOpenDrawerCategory = (state: RootState) =>
  state.filters.openDrawerCategory;

export const selectSelectedFiltersByCategory =
  (categoryId: CategoryId) =>
  (state: RootState): FiltersMap =>
    state.filters.selectedFilters[categoryId] || {};
