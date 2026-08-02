import { describe, expect, it } from 'vitest';

import type { OrdersResponse } from '@/src/entities/order/model/types';
import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import { PIZZA_ID, createUser } from '@/src/test/integration/fixtures';
import { GET } from './route';

const makeOrders = async (
  owner: { userId?: number; guestId?: string },
  count: number,
) => {
  for (let index = 0; index < count; index += 1) {
    await prisma.order.create({
      data: {
        userId: owner.userId ?? null,
        guestId: owner.guestId ?? null,
        fullPrice: 100 * (index + 1),
        name: `Заказ ${index + 1}`,
        phone: '89659862820',
        email: 'ivan@example.com',
        deliveryMode: 'Delivery',
        deliveryTime: 'ASAP',
        paymentMethod: 'Cash',
        changeMethod: 'WithoutChange',
        createdAt: new Date(Date.now() + index * 1000),
        items: {
          create: {
            productId: PIZZA_ID,
            title: 'Пепперони Классик',
            imageSrc: '/images/pizzas/pizza1.png',
            price: 100 * (index + 1),
            quantity: 1,
            ingredients: [],
            selectedOptions: {},
          },
        },
      },
    });
  }
};

const list = (query = '', cookies: Record<string, string> = {}) =>
  callRoute<OrdersResponse & { error?: string }>(GET, {
    url: `/api/orders/me${query}`,
    cookies,
  });

describe('GET /api/orders/me', () => {
  // Order history is a public page for guests, so "no identity at all" is an
  // empty history rather than an auth failure.
  it('returns an empty history for a visitor with no session and no guest cookie', async () => {
    const { status, json } = await list();

    expect(status).toBe(200);
    expect(json.total).toBe(0);
    expect(json.items).toEqual([]);
  });

  it('lists a user\'s orders, newest first', async () => {
    const user = await createUser();
    await makeOrders({ userId: user.id }, 3);

    const { status, json } = await list('', user.cookies);

    expect(status).toBe(200);
    expect(json.total).toBe(3);
    expect(json.items).toHaveLength(3);
    expect(json.items[0].name).toBe('Заказ 3');
  });

  it('paginates', async () => {
    const user = await createUser();
    await makeOrders({ userId: user.id }, 7);

    const first = await list('?page=1&limit=5', user.cookies);
    const second = await list('?page=2&limit=5', user.cookies);

    expect(first.json.items).toHaveLength(5);
    expect(second.json.items).toHaveLength(2);
    expect(second.json.total).toBe(7);
    expect(second.json.page).toBe(2);
  });

  it('defaults to page 1 with 5 per page', async () => {
    const user = await createUser();
    await makeOrders({ userId: user.id }, 6);

    const { json } = await list('', user.cookies);

    expect(json.items).toHaveLength(5);
    expect(json.page).toBe(1);
    expect(json.limit).toBe(5);
  });

  it('never shows another account\'s orders', async () => {
    const user = await createUser();
    const stranger = await createUser();
    await makeOrders({ userId: stranger.id }, 4);

    const { json } = await list('', user.cookies);

    expect(json.total).toBe(0);
    expect(json.items).toEqual([]);
  });

  it('lists guest orders by cookie', async () => {
    await makeOrders({ guestId: 'guest-1' }, 2);
    await makeOrders({ guestId: 'guest-2' }, 3);

    const { json } = await list('', { guestId: 'guest-1' });

    expect(json.total).toBe(2);
  });

  it('rejects nonsensical paging', async () => {
    const user = await createUser();

    expect((await list('?page=0', user.cookies)).status).toBe(400);
    expect((await list('?limit=999', user.cookies)).status).toBe(400);
  });
});
