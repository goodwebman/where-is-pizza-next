import { describe, expect, it } from 'vitest';

import type { Order } from '@/src/entities/order/model/types';
import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import {
  DESSERT_ID,
  DESSERT_PRICE,
  PIZZA_BASE_PRICE,
  PIZZA_SIZE_30_SURCHARGE,
  addCartItem,
  createGuestCart,
  createUser,
  createUserCart,
} from '@/src/test/integration/fixtures';
import { POST } from './route';

const validOrder = {
  name: 'Иван',
  phone: '89659862820',
  email: 'ivan@example.com',
  deliveryMode: 'delivery',
  deliveryTime: 'asap',
  paymentMethod: 'cash',
  changeMethod: 'withoutChange',
  address: {
    street: 'Ленина',
    house: '12',
    entrance: '1',
    floor: '3',
    apartment: '45',
    intercom: '45K',
  },
};

const submit = (
  body: Record<string, unknown> = validOrder,
  cookies: Record<string, string> = {},
) =>
  callRoute<Order & { error?: string }>(POST, {
    url: '/api/orders',
    method: 'POST',
    body,
    cookies,
  });

describe('POST /api/orders', () => {
  it('creates an order from the cart', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id, { quantity: 2 });

    const { status, json } = await submit(validOrder, { guestId });

    expect(status).toBe(200);
    expect(json.items).toHaveLength(1);
    expect(json.status).toBe('PENDING');
    expect(json.address).toMatchObject({ street: 'Ленина', house: '12' });
  });

  it('totals from the stored line prices', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id, { quantity: 2 });
    await addCartItem(cart.id, {
      productId: DESSERT_ID,
      price: DESSERT_PRICE,
      selectedOptions: {},
    });

    const { json } = await submit(validOrder, { guestId });

    const expected =
      (PIZZA_BASE_PRICE + PIZZA_SIZE_30_SURCHARGE) * 2 + DESSERT_PRICE;

    expect(json.fullPrice).toBe(expected);
  });

  it('ignores a total supplied by the client', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { json } = await submit({ ...validOrder, fullPrice: 1 }, { guestId });

    expect(json.fullPrice).toBe(PIZZA_BASE_PRICE + PIZZA_SIZE_30_SURCHARGE);
  });

  it('snapshots items as arrays, not JSON strings', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { json } = await submit(validOrder, { guestId });

    expect(Array.isArray(json.items[0].ingredients)).toBe(true);
    expect(json.items[0].selectedOptions).toEqual({ Размер: ['30 см'] });
  });

  it('empties the cart in the same transaction', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    await submit(validOrder, { guestId });

    expect(await prisma.cartItem.count()).toBe(0);
    // The cart itself survives, so the guest can keep shopping.
    expect(await prisma.cart.findUnique({ where: { id: cart.id } })).not.toBeNull();
  });

  it('records the guest id on the order', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { json } = await submit(validOrder, { guestId });

    const stored = await prisma.order.findUnique({ where: { id: json.id } });

    // Independent of the cart relation, so the history survives a later merge.
    expect(stored?.guestId).toBe(guestId);
  });

  it('attributes the order to a signed-in user instead', async () => {
    const user = await createUser();
    const cart = await createUserCart(user.id);
    await addCartItem(cart.id);

    const { json } = await submit(validOrder, user.cookies);

    const stored = await prisma.order.findUnique({ where: { id: json.id } });

    expect(stored?.userId).toBe(user.id);
    expect(stored?.guestId).toBeNull();
  });

  it('400s on an unknown enum value rather than 500', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { status } = await submit(
      { ...validOrder, deliveryMode: 'teleport' },
      { guestId },
    );

    expect(status).toBe(400);
  });

  it('accepts applePay', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { status, json } = await submit(
      { ...validOrder, paymentMethod: 'applePay' },
      { guestId },
    );

    expect(status).toBe(200);
    // Stored as Card, and reported back as the canonical wire value.
    expect(json.paymentMethod).toBe('card');
  });

  it('400s on an empty cart', async () => {
    const { guestId } = await createGuestCart();

    const { status, json } = await submit(validOrder, { guestId });

    expect(status).toBe(400);
    expect(json.error).toBe('Cart is empty');
  });

  it('400s when there is no cart at all', async () => {
    const { status } = await submit(validOrder);

    expect(status).toBe(400);
  });

  it('rejects an invalid phone number', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { status } = await submit(
      { ...validOrder, phone: '123' },
      { guestId },
    );

    expect(status).toBe(400);
  });

  it('requires a restaurant for pickup', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { status } = await submit(
      { ...validOrder, deliveryMode: 'pickup', address: undefined },
      { guestId },
    );

    expect(status).toBe(400);
  });

  it('leaves nothing behind when creation fails', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    await submit({ ...validOrder, deliveryMode: 'teleport' }, { guestId });

    expect(await prisma.order.count()).toBe(0);
    expect(await prisma.orderItem.count()).toBe(0);
    // And the cart is untouched, so the customer does not lose their basket.
    expect(await prisma.cartItem.count()).toBe(1);
  });

  it('returns null for the address on a pickup order', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { json } = await submit(
      {
        ...validOrder,
        deliveryMode: 'pickup',
        restaurantId: 'rest-1',
        address: undefined,
      },
      { guestId },
    );

    expect(json.address).toBeNull();
  });
});
