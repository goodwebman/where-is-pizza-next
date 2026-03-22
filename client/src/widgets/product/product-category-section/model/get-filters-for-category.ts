import { FiltersMap } from '@/src/entities/filters/model/types';
import { CategoryId } from '@/src/shared/config';

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
