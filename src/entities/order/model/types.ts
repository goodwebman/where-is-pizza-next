export enum DeliveryMode {
  Delivery = 'delivery',
  Pickup = 'pickup',
}

export enum DeliveryTime {
  ASAP = 'asap',
  Scheduled = 'scheduled',
}

export enum PaymentMethod {
  Cash = 'cash',
  Card = 'card',
  ApplePay = 'applePay',
}

export enum ChangeMethod {
  WithoutChange = 'withoutChange',
  WithChange = 'withChange',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export type Address = {
  street?: string;
  house?: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  intercom?: string;
};

export type CreateOrderDTO = {
  name: string;
  phone: string;
  email: string;

  deliveryMode: DeliveryMode;
  deliveryTime: DeliveryTime;

  address?: Address;

  scheduledDate?: string;
  scheduledTime?: string;

  restaurantId?: string;

  paymentMethod: PaymentMethod;
  changeMethod: ChangeMethod;
  changeFrom?: string;

  comment?: string;
};

export type Ingredients = {
  id: string;
  label: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  title: string;
  imageSrc: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, string[]>;
  ingredients?: Ingredients[];
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
  address?: Address | null;
  scheduledDate?: string | null;
  scheduledTime?: string | null;

  restaurantId?: string | null;

  paymentMethod: PaymentMethod;
  changeMethod: ChangeMethod;
  changeFrom?: string | null;

  comment?: string | null;

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
