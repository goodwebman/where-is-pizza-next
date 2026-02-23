import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  FiltersMap, SelectedFilters } from './types';
import { CATEGORIES, CategoryId } from '@/src/shared/config'

export interface FiltersState {
  openDrawerCategory: CategoryId | null;
  selectedFilters: SelectedFilters;
}

const initialState: FiltersState = {
  openDrawerCategory: null,
  selectedFilters: CATEGORIES.reduce((acc, cat) => {
    acc[cat] = {};
    return acc;
  }, {} as SelectedFilters),
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    openFiltersDrawer: (state, action: PayloadAction<CategoryId>) => {
      state.openDrawerCategory = action.payload;
    },
    closeFiltersDrawer: state => {
      state.openDrawerCategory = null;
    },
    toggleFilter: (
      state,
      action: PayloadAction<{ categoryId: CategoryId; group: string; option: string }>
    ) => {
      const { categoryId, group, option } = action.payload;
      const groupFilters = state.selectedFilters[categoryId][group] || [];
      state.selectedFilters[categoryId][group] = groupFilters.includes(option)
        ? groupFilters.filter(x => x !== option)
        : [...groupFilters, option];
    },

    setFilters: (
      state,
      action: PayloadAction<{ categoryId: CategoryId; filters: FiltersMap }>
    ) => {
      state.selectedFilters[action.payload.categoryId] = action.payload.filters;
    },
    resetCategoryFilters: (state, action: PayloadAction<CategoryId>) => {
      state.selectedFilters[action.payload] = {};
    },
  },
});

export const {
  openFiltersDrawer,
  closeFiltersDrawer,
  toggleFilter,
  setFilters,
  resetCategoryFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;