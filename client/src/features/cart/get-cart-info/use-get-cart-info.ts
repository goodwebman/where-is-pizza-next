import { QUERY_KEYS } from '@/src/shared/api';
import { useQuery } from '@tanstack/react-query';
import { Cart, cartApi } from '@/src/entities/cart'


export const useGetCartInfo = () => {
  const query = useQuery<Cart | null>({
    queryKey: [QUERY_KEYS.CART],
    queryFn: cartApi.getCart,
    staleTime: 1000 * 60 * 5,
  });

  const cart = query.data ?? null;

  const totalPrice =
    cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    ...query,
    cart,
    totalPrice,
    totalItems,
  };
};