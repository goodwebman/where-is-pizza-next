import { api } from '@/src/shared/api';
import { CreateOrderDTO, GetOrdersParams, Order, OrdersResponse } from '../model/types';

export const orderApi = {
  create: async (data: CreateOrderDTO) => {
    return await api.post<Order>('/orders', data);
  },

  getMyOrders: async (params: GetOrdersParams) => {
    const { page, limit } = params;
    return await api.get<OrdersResponse>('/orders/me', {
      params: { page, limit },
    });
  },
};
