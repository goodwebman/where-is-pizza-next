import 'server-only';

import type { Order, OrderItem } from '@/src/entities/order/model/types';
import type { RequestActor } from '@/src/server/auth/session';
import { prisma, type Db } from '@/src/server/db/prisma';
import { withTransaction } from '@/src/server/db/transaction';
import { parseCanonicalOptions } from '@/src/server/domain/cart/canonical-options';
import { toReadableOptions } from '@/src/server/domain/cart/transform-options';
import {
  toDbChangeMethod,
  toDbDeliveryMode,
  toDbDeliveryTime,
  toDbPaymentMethod,
  toWireChangeMethod,
  toWireDeliveryMode,
  toWireDeliveryTime,
  toWirePaymentMethod,
} from '@/src/server/domain/order/map-enums';
import { toAddress } from '@/src/server/domain/order/map-order';
import { badRequest, notFound, unauthorized } from '@/src/server/http/errors';
import type { Ingredients } from '@/src/entities/product/model/types';
import type {
  CreateOrderInput,
  GetOrdersQuery,
  OrderStatus,
} from '@/src/shared/contracts';

const orderInclude = { items: { orderBy: { id: 'asc' } } } as const;

type OrderRow = {
  id: string;
  status: string;
  fullPrice: number;
  name: string;
  phone: string;
  email: string;
  deliveryMode: string;
  deliveryTime: string;
  street: string | null;
  house: string | null;
  entrance: string | null;
  floor: string | null;
  apartment: string | null;
  intercom: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  restaurantId: string | null;
  paymentMethod: string;
  changeMethod: string;
  changeFrom: string | null;
  comment: string | null;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    title: string;
    imageSrc: string;
    price: number;
    quantity: number;
    ingredients: unknown;
    selectedOptions: unknown;
  }[];
};

const toOrderItemDto = (item: OrderRow['items'][number]): OrderItem => ({
  id: item.id,
  productId: item.productId,
  title: item.title,
  imageSrc: item.imageSrc,
  price: item.price,
  quantity: item.quantity,
  // Both are JSON columns now. They used to be stringified into String columns
  // and handed to the client as raw JSON text, while the client's type promised
  // arrays and objects.
  ingredients: (Array.isArray(item.ingredients)
    ? item.ingredients
    : []) as Ingredients[],
  selectedOptions: (item.selectedOptions ?? {}) as Record<string, string[]>,
});

const toOrderDto = (order: OrderRow): Order => ({
  id: order.id,
  status: order.status as OrderStatus,
  fullPrice: order.fullPrice,
  name: order.name,
  phone: order.phone,
  email: order.email,
  deliveryMode: toWireDeliveryMode(order.deliveryMode),
  deliveryTime: toWireDeliveryTime(order.deliveryTime),
  // Only the address columns: passing the whole row would fold every non-null
  // order field into the address object.
  address: toAddress({
    street: order.street,
    house: order.house,
    entrance: order.entrance,
    floor: order.floor,
    apartment: order.apartment,
    intercom: order.intercom,
  }),
  scheduledDate: order.scheduledDate,
  scheduledTime: order.scheduledTime,
  restaurantId: order.restaurantId,
  paymentMethod: toWirePaymentMethod(order.paymentMethod),
  changeMethod: toWireChangeMethod(order.changeMethod),
  changeFrom: order.changeFrom,
  comment: order.comment,
  items: order.items.map(toOrderItemDto),
  createdAt: order.createdAt.toISOString(),
});

/**
 * Restricts a query to orders the caller owns.
 *
 * The old handler built this filter conditionally and, when neither a user nor
 * a guest cookie was present, simply left it out — so an anonymous request for
 * any order id got that order back.
 */
const ownershipFilter = (actor: RequestActor) => {
  if (actor.userId) return { userId: actor.userId };
  if (actor.guestId) return { guestId: actor.guestId };

  throw notFound('Order not found', 'ORDER_NOT_FOUND');
};

export const createOrder = async (
  actor: RequestActor,
  input: CreateOrderInput,
  db: Db = prisma,
): Promise<Order> =>
  withTransaction(db, async tx => {
    const cart = await tx.cart.findUnique({
      where: actor.userId
        ? { userId: actor.userId }
        : { guestId: actor.guestId ?? '' },
      include: {
        items: {
          include: {
            product: {
              include: { options: { include: { values: true } } },
            },
          },
        },
      },
    });

    if (!cart) throw badRequest('Cart not found', 'CART_NOT_FOUND');
    if (cart.items.length === 0) {
      throw badRequest('Cart is empty', 'CART_EMPTY');
    }

    // Prices come from the cart lines, which the server priced from the
    // catalogue when they were added — never from the checkout payload.
    const fullPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const order = await tx.order.create({
      data: {
        userId: actor.userId ?? null,
        // Snapshot, independent of the cart's lifetime, so guest history
        // survives the cart being merged into an account or cleared.
        guestId: actor.userId ? null : (actor.guestId ?? null),
        cartId: cart.id,
        status: 'PENDING',
        fullPrice,

        name: input.name,
        phone: input.phone,
        email: input.email,

        deliveryMode: toDbDeliveryMode(input.deliveryMode),
        deliveryTime: toDbDeliveryTime(input.deliveryTime),

        street: input.address?.street ?? null,
        house: input.address?.house ?? null,
        entrance: input.address?.entrance ?? null,
        floor: input.address?.floor ?? null,
        apartment: input.address?.apartment ?? null,
        intercom: input.address?.intercom ?? null,

        scheduledDate: input.scheduledDate ?? null,
        scheduledTime: input.scheduledTime ?? null,
        restaurantId: input.restaurantId ?? null,

        paymentMethod: toDbPaymentMethod(input.paymentMethod),
        changeMethod: toDbChangeMethod(input.changeMethod),
        changeFrom: input.changeFrom ?? null,
        comment: input.comment ?? null,

        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            title: item.product.title,
            imageSrc: item.product.imageSrc,
            price: item.price,
            quantity: item.quantity,
            ingredients: item.product.ingredients ?? [],
            // Resolved to titles at order time, so history stays readable even
            // if the product's options are renamed later.
            selectedOptions: toReadableOptions(
              parseCanonicalOptions(item.selectedOptions),
              item.product.options,
            ),
          })),
        },
      },
      include: orderInclude,
    });

    // Same transaction: a crash between creating the order and emptying the
    // cart would otherwise let the customer order the same food twice.
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return toOrderDto(order);
  });

export const getOrderById = async (
  actor: RequestActor,
  orderId: string,
  db: Db = prisma,
): Promise<Order> => {
  const order = await db.order.findFirst({
    where: { id: orderId, ...ownershipFilter(actor) },
    include: orderInclude,
  });

  if (!order) throw notFound('Order not found', 'ORDER_NOT_FOUND');

  return toOrderDto(order);
};

export const getMyOrders = async (
  actor: RequestActor,
  { page, limit }: GetOrdersQuery,
  db: Db = prisma,
): Promise<{ items: Order[]; total: number; page: number; limit: number }> => {
  if (!actor.userId && !actor.guestId) throw unauthorized();

  const where = ownershipFilter(actor);

  const [total, rows] = await Promise.all([
    db.order.count({ where }),
    db.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return { items: rows.map(toOrderDto), total, page, limit };
};
