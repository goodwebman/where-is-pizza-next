export type FilterGroup = string;
export type FilterOption = string;

export type FiltersMap = Record<FilterGroup, FilterOption[]>;

export type SelectedFilters = Record<CategoryId, FiltersMap>;

export const CATEGORIES = [
  'pizza',
  'sushi',
  'dessert',
  'drinks',
  'sauce',
  'snacks',
  'combos',
] as const;

export const CATEGORY_NAMES = CATEGORIES.reduce((acc, c) => {
  acc[c] = c;
  return acc;
}, {} as Record<CategoryId, CategoryId>);
export type CategoryId = (typeof CATEGORIES)[number];

export const EMPTY_FILTERS: FiltersMap = {};
