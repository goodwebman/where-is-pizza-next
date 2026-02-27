'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/src/shared/api';
import toast from 'react-hot-toast';
import { cartApi } from '../api';
import { AddToCartPayload } from '../model/types';

export const useAddProductToCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => cartApi.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toast.success('Добавлено в корзину', {
        position: 'top-center',
      });
    },
    onError: () => {
      toast.success('Ошибка добавления в корзину', {
        position: 'top-center',
      });
    },
  });

  return {
    addToCart: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as string | null,
  };
};
