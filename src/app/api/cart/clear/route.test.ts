import { describe, expect, it } from 'vitest';

import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import {
  DESSERT_ID,
  addCartItem,
  createGuestCart,
  createUser,
  createUserCart,
} from '@/src/test/integration/fixtures';
import { DELETE } from './route';

const clear = (cookies: Record<string, string> = {}) =>
  callRoute<{ success?: boolean; error?: string }>(DELETE, {
    url: '/api/cart/clear',
    method: 'DELETE',
    cookies,
  });

describe('DELETE /api/cart/clear', () => {
  it('actually empties the cart', async () => {
    // Two bugs used to sit here: the route was shadowed by /cart/:itemId, and
    // the handler passed the guest cookie where a cart id was expected, so the
    // delete matched nothing.
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);
    await addCartItem(cart.id, { productId: DESSERT_ID, price: 290 });

    const { status, json } = await clear({ guestId });

    expect(status).toBe(200);
    expect(json.success).toBe(true);
    expect(await prisma.cartItem.count()).toBe(0);
  });

  it('keeps the cart itself, only its contents go', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    await clear({ guestId });

    expect(await prisma.cart.findUnique({ where: { id: cart.id } })).not.toBeNull();
  });

  it('clears the account cart for a signed-in user', async () => {
    const user = await createUser();
    const cart = await createUserCart(user.id);
    await addCartItem(cart.id);

    const { status } = await clear(user.cookies);

    expect(status).toBe(200);
    expect(await prisma.cartItem.count()).toBe(0);
  });

  it('404s when there is no cart', async () => {
    const { status } = await clear();

    expect(status).toBe(404);
  });

  it('leaves another visitor\'s cart alone', async () => {
    const other = await createGuestCart();
    await addCartItem(other.cart.id);

    const mine = await createGuestCart();
    await addCartItem(mine.cart.id);

    await clear({ guestId: mine.guestId });

    const remaining = await prisma.cartItem.findMany();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].cartId).toBe(other.cart.id);
  });
});
