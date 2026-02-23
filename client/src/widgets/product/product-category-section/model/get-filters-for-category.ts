import { CategoryId, FiltersMap } from '@/src/entities/filters/model/types';

/**
 * Возвращает фильтры для конкретной категории из объекта всех фильтров.
 * Если фильтров для категории нет, вернёт undefined.
 */
export const getFiltersForCategory = (
  categoryId: CategoryId,
  allFilters: Partial<Record<CategoryId, FiltersMap>>,
): FiltersMap | undefined => {
  return allFilters[categoryId];
};
