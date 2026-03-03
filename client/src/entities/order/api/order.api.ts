import { api } from '@/src/shared/api';
import { Order, OrderDraft } from '../model/types';

export const orderApi = {
  create: (data: OrderDraft) => {
    api.post<Order>('/orders', data);
  },

  getMyOrders: () => api.get<Order[]>('/orders/me'),
};
