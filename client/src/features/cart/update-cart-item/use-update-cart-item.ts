import { QUERY_KEYS } from '@/src/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/src/entities/cart'

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => cartApi.updateCartItem(cartItemId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });

  return {
    updateQuantity: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
