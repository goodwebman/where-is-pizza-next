'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { QUERY_KEYS } from '@/src/shared/api';
import { cartApi } from '@/src/entities/cart'


export const useDeleteProductFromCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (itemId: string) => cartApi.deleteFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toast.success('Товар удалён из корзины', {
        position: 'top-center',
      });
    },
    onError: () => {
      toast.error('Ошибка при удалении товара', {
        position: 'top-center',
      });
    },
  });

  return {
    removeFromCart: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as string | null,
  };
};
