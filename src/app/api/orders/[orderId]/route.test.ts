import { describe, expect, it } from 'vitest';

import type { Order } from '@/src/entities/order/model/types';
import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import { PIZZA_ID, createUser } from '@/src/test/integration/fixtures';
import { GET } from './route';

const makeOrder = (owner: { userId?: number; guestId?: string }) =>
  prisma.order.create({
    data: {
      userId: owner.userId ?? null,
      guestId: owner.guestId ?? null,
      fullPrice: 579,
      name: 'Иван',
      phone: '89659862820',
      email: 'ivan@example.com',
      deliveryMode: 'Delivery',
      deliveryTime: 'ASAP',
      paymentMethod: 'Cash',
      changeMethod: 'WithoutChange',
      items: {
        create: {
          productId: PIZZA_ID,
          title: 'Пепперони Классик',
          imageSrc: '/images/pizzas/pizza1.png',
          price: 579,
          quantity: 1,
          ingredients: [{ id: 'cheese', label: 'Сыр' }],
          selectedOptions: { 'Размер': ['30 см'] },
        },
      },
    },
  });

const fetchOrder = (orderId: string, cookies: Record<string, string> = {}) =>
  callRoute<Order & { error?: string }>(GET, {
    url: `/api/orders/${orderId}`,
    cookies,
    params: { orderId },
  });

describe('GET /api/orders/[orderId]', () => {
  it('returns the order to its guest owner', async () => {
    const order = await makeOrder({ guestId: 'guest-1' });

    const { status, json } = await fetchOrder(order.id, { guestId: 'guest-1' });

    expect(status).toBe(200);
    expect(json.id).toBe(order.id);
    expect(json.items[0].ingredients).toEqual([{ id: 'cheese', label: 'Сыр' }]);
  });

  it('404s for a caller carrying no cookies at all', async () => {
    // The old handler dropped its ownership filter entirely in this case and
    // handed any order to anyone who knew an id.
    const order = await makeOrder({ guestId: 'guest-1' });

    const { status, json } = await fetchOrder(order.id);

    expect(status).toBe(404);
    expect(json.error).toBe('Order not found');
  });

  it('404s for a different guest', async () => {
    const order = await makeOrder({ guestId: 'guest-1' });

    const { status } = await fetchOrder(order.id, { guestId: 'guest-2' });

    expect(status).toBe(404);
  });

  it('404s for a different user', async () => {
    const owner = await createUser();
    const stranger = await createUser();
    const order = await makeOrder({ userId: owner.id });

    const { status } = await fetchOrder(order.id, stranger.cookies);

    expect(status).toBe(404);
  });

  it('returns the order to its signed-in owner', async () => {
    const user = await createUser();
    const order = await makeOrder({ userId: user.id });

    const { status } = await fetchOrder(order.id, user.cookies);

    expect(status).toBe(200);
  });

  it('404s on an unknown id', async () => {
    const { status } = await fetchOrder('00000000-0000-0000-0000-000000000000', {
      guestId: 'guest-1',
    });

    expect(status).toBe(404);
  });
});
