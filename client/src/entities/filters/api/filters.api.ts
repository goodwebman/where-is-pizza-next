import { api } from '@/src/shared/api/axios/api-helpers';
import { CategoryId } from '@/src/shared/config';
import { FiltersMap } from '../model/types';

export const filtersApi = {
  getFilters: async (categoryId: CategoryId): Promise<FiltersMap> => {
    return api.get<FiltersMap>(`/products/filters/${categoryId}`);
  },
};
