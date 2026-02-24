import { api } from '@/src/shared/api';
import {  FiltersMap } from '../../filters/model/types';
import { Product, ProductDetails } from '../model/types';
import { CategoryId } from '@/src/shared/config'

export const productsApi = {
  getProducts: async (
    categoryId: CategoryId,
    filters?: FiltersMap,
  ): Promise<Product[]> => {
    return await api.post<ProductDetails[]>('/products', {
      categoryId,
      filters,
    });
  },
};
