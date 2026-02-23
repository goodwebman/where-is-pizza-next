import { api } from '@/src/shared/api';
import { CategoryId, FiltersMap } from '../../filters/model/types';
import { Product } from '../model/types';

export const productsApi = {
  getProducts: async (
    categoryId: CategoryId,
    filters?: FiltersMap,
  ): Promise<Product[]> => {
    return await api.post<Product[]>('/products', {
      categoryId,
      filters,
    });
  },
};
