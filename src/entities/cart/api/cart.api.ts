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
    return await api.delete(`/cart/${cartItemId}`);
  },

  updateCartItem: async (
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem> => {
    return await api.patch<CartItem>(`/cart/${cartItemId}`, { quantity });
  },

  clearCart: async (): Promise<null> => {
    return await api.delete('/cart/clear');
  },
};
