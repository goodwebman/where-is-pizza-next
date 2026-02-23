import { CategoryId } from '@/src/shared/config'

export type FilterGroup = string;
export type FilterOption = string;

export type FiltersMap = Record<FilterGroup, FilterOption[]>;

export type SelectedFilters = Record<CategoryId, FiltersMap>;

export const EMPTY_FILTERS: FiltersMap = {};
