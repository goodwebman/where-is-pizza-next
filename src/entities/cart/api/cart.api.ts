import { api } from '@/src/shared/api';
import { AddToCartPayload, Cart, CartItem } from '../model/types';

export const cartApi = {
  addToCart: async (payload: AddToCartPayload): Promise<CartItem> => {
    return await api.post<CartItem>('/cart', payload);
  },

  getCart: async (): Promise<Cart | null> => {
    return await api.get<Cart | null>('/cart');
  },

  deleteFromCart: async (cartItemId: string): Promise<null> => {
    // Items are a nested resource under /cart — the handlers live in
    // app/api/cart/items/[itemId]. The previous path (`/cart/${id}`) hit no
    // route and 404'd on every delete.
    return await api.delete(`/cart/items/${cartItemId}`);
  },

  updateCartItem: async (
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem> => {
    return await api.patch<CartItem>(`/cart/items/${cartItemId}`, { quantity });
  },

  clearCart: async (): Promise<null> => {
    return await api.delete('/cart/clear');
  },
};
