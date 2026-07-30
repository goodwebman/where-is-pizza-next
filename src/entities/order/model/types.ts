import type { Ingredients } from '@/src/entities/product/model/types';
import type {
  ChangeMethod,
  DeliveryMode,
  DeliveryTime,
  OrderStatus,
  PaymentMethod,
} from '@/src/shared/contracts';

/**
 * Enums and the create-order payload live in shared/contracts so the server
 * validates exactly what the client sends. Re-exported here to keep the
 * entity's public surface stable for existing imports.
 */
export {
  ChangeMethod,
  DeliveryMode,
  DeliveryTime,
  OrderStatus,
  PaymentMethod,
  type Address,
  type CreateOrderInput as CreateOrderDTO,
} from '@/src/shared/contracts';

export type { Ingredients };

export type OrderItem = {
  id: string;
  productId: string;
  title: string;
  imageSrc: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, string[]>;
  ingredients: Ingredients[];
};

export type Order = {
  id: string;
  status: OrderStatus;
  fullPrice: number;

  name: string;
  phone: string;
  email: string;

  deliveryMode: DeliveryMode;
  deliveryTime: DeliveryTime;
  address: {
    street?: string;
    house?: string;
    entrance?: string;
    floor?: string;
    apartment?: string;
    intercom?: string;
  } | null;
  scheduledDate: string | null;
  scheduledTime: string | null;

  restaurantId: string | null;

  paymentMethod: PaymentMethod;
  changeMethod: ChangeMethod;
  changeFrom: string | null;

  comment: string | null;

  items: OrderItem[];

  createdAt: string;
};

export type OrdersResponse = {
  items: Order[];
  total: number;
  page: number;
  limit: number;
};

export type GetOrdersParams = { page: number; limit: number };
