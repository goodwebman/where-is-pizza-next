import { api } from '@/src/shared/api/axios/api-helpers';
import { FiltersMap } from '../model/types'


export const filtersApi = {
  getPizzaFilters: async (): Promise<FiltersMap> => {
    return api.get<FiltersMap>('/products/filters/pizza');
  },

  getSushiFilters: async (): Promise<FiltersMap> => {
    return api.get<FiltersMap>('/products/filters/sushi');
  },
};
