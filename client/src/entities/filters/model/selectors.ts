import { RootState } from '@/src/shared/store/redux-store';
import {  FiltersMap } from './types';
import { CategoryId } from '@/src/shared/config'

export const selectOpenDrawerCategory = (state: RootState) =>
  state.filters.openDrawerCategory;

export const selectSelectedFiltersByCategory =
  (categoryId: CategoryId) =>
  (state: RootState): FiltersMap =>
    state.filters.selectedFilters[categoryId] || {};
