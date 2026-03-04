'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { orderApi } from '@/src/entities/order/api/order.api';
import { cartApi } from '@/src/entities/cart/api/cart.api';
import { CreateOrderDTO, Order } from '@/src/entities/order/model/types';
import { QUERY_KEYS } from '@/src/shared/api';

export const useOrderSubmit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, Error, CreateOrderDTO>({
    mutationFn: orderApi.create,

    onSuccess: async () => {
  
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER] });


      await cartApi.clearCart();

  
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });

      toast.success('Заказ успешно оформлен', {
        position: 'top-center',
      });
    },

    onError: error => {
      toast.error(error.message || 'Ошибка при оформлении заказа', {
        position: 'top-center',
      });
    },
  });

  return {
    submitOrder: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};