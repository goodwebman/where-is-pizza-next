import { describe, expect, it } from 'vitest';

import type { Cart } from '@/src/entities/cart/model/types';
import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import {
  addCartItem,
  createGuestCart,
  createUser,
  createUserCart,
} from '@/src/test/integration/fixtures';
import { DELETE, PATCH } from './route';

const patch = (
  itemId: string,
  quantity: number,
  cookies: Record<string, string> = {},
) =>
  callRoute<Cart & { error?: string }>(PATCH, {
    url: `/api/cart/items/${itemId}`,
    method: 'PATCH',
    body: { quantity },
    cookies,
    params: { itemId },
  });

const remove = (itemId: string, cookies: Record<string, string> = {}) =>
  callRoute<Cart & { error?: string }>(DELETE, {
    url: `/api/cart/items/${itemId}`,
    method: 'DELETE',
    cookies,
    params: { itemId },
  });

describe('PATCH /api/cart/items/[itemId]', () => {
  it('updates the quantity of an owned line', async () => {
    const { cart, guestId } = await createGuestCart();
    const item = await addCartItem(cart.id, { quantity: 1 });

    const { status, json } = await patch(item.id, 4, { guestId });

    expect(status).toBe(200);
    expect(json.items[0].quantity).toBe(4);
  });

  it('refuses to touch another cart, even with a valid item id', async () => {
    // The old handler updated by item id alone after looking up the caller's
    // cart, so anyone could change anyone else's cart line.
    const victim = await createGuestCart();
    const victimItem = await addCartItem(victim.cart.id, { quantity: 1 });

    const attacker = await createGuestCart();

    const { status } = await patch(victimItem.id, 99, {
      guestId: attacker.guestId,
    });

    expect(status).toBe(404);

    const untouched = await prisma.cartItem.findUnique({
      where: { id: victimItem.id },
    });
    expect(untouched?.quantity).toBe(1);
  });

  it('refuses when the caller has no cart at all', async () => {
    const { cart } = await createGuestCart();
    const item = await addCartItem(cart.id);

    const { status } = await patch(item.id, 5);

    expect(status).toBe(404);
  });

  it('refuses a signed-in user reaching into a guest cart', async () => {
    const user = await createUser();
    await createUserCart(user.id);

    const { cart: guestCart } = await createGuestCart();
    const guestItem = await addCartItem(guestCart.id);

    const { status } = await patch(guestItem.id, 7, user.cookies);

    expect(status).toBe(404);
  });

  it('rejects zero and negative quantities', async () => {
    const { cart, guestId } = await createGuestCart();
    const item = await addCartItem(cart.id);

    expect((await patch(item.id, 0, { guestId })).status).toBe(400);
    expect((await patch(item.id, -2, { guestId })).status).toBe(400);
  });

  it('404s on an unknown item id', async () => {
    const { guestId } = await createGuestCart();

    const { status } = await patch('00000000-0000-0000-0000-000000000000', 2, {
      guestId,
    });

    expect(status).toBe(404);
  });
});

describe('DELETE /api/cart/items/[itemId]', () => {
  it('removes an owned line and returns the updated cart', async () => {
    const { cart, guestId } = await createGuestCart();
    const item = await addCartItem(cart.id);

    const { status, json } = await remove(item.id, { guestId });

    expect(status).toBe(200);
    expect(json.items).toHaveLength(0);
    expect(await prisma.cartItem.count()).toBe(0);
  });

  it('refuses to delete from another cart', async () => {
    const victim = await createGuestCart();
    const victimItem = await addCartItem(victim.cart.id);
    const attacker = await createGuestCart();

    const { status } = await remove(victimItem.id, {
      guestId: attacker.guestId,
    });

    expect(status).toBe(404);
    expect(await prisma.cartItem.count()).toBe(1);
  });

  it('rejects a cross-origin delete', async () => {
    const { cart, guestId } = await createGuestCart();
    const item = await addCartItem(cart.id);

    const { status } = await callRoute(DELETE, {
      url: `/api/cart/items/${item.id}`,
      method: 'DELETE',
      cookies: { guestId },
      params: { itemId: item.id },
      origin: 'https://evil.example',
    });

    expect(status).toBe(403);
  });
});
