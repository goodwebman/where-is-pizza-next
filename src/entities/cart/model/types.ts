import { ProductDetails } from '../../product/model/types';

/**
 * Two shapes share this alias by direction: outbound it is
 * Record<optionId, valueId[]>, inbound the server resolves it to
 * Record<optionTitle, valueTitle[]> for display.
 */
export type SelectedOptions = Record<string, string[]>;

export type CartItem = {
  id: string;
  quantity: number;
  selectedOptions: SelectedOptions;
  product: ProductDetails;
  price: number;
};

export type Cart = {
  id: string;
  userId?: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type AddToCartPayload = {
  productId: string;
  quantity?: number;
  selectedOptions?: SelectedOptions;
};
