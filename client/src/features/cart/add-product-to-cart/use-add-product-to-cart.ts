'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AddToCartPayload, cartApi } from '@/src/entities/cart';
import { QUERY_KEYS } from '@/src/shared/api';
import toast from 'react-hot-toast';

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
    onError: error => {
      toast.error(JSON.stringify(error), {
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
