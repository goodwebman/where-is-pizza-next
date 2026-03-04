import { api } from '@/src/shared/api';
import { CreateOrderDTO, Order } from '../model/types';

export const orderApi = {
  create: async (data: CreateOrderDTO) => {
    return await api.post<Order>('/orders', data);
  },

  getMyOrders: async () => {
    return await api.get<Order[]>('/orders/me');
  },
};
