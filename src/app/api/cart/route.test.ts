import { describe, expect, it } from 'vitest';

import type { Cart, CartItem } from '@/src/entities/cart/model/types';
import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import {
  DESSERT_ID,
  DESSERT_PRICE,
  PIZZA_BASE_PRICE,
  PIZZA_EXTRA_CHEESE,
  PIZZA_EXTRA_CHEESE_SURCHARGE,
  PIZZA_EXTRA_OPTION,
  PIZZA_ID,
  PIZZA_SIZE_30,
  PIZZA_SIZE_30_SURCHARGE,
  PIZZA_SIZE_OPTION,
  addCartItem,
  createGuestCart,
  createUser,
  createUserCart,
  validPizzaOptions,
} from '@/src/test/integration/fixtures';
import { GET, POST } from './route';

const add = (body: Record<string, unknown>, cookies: Record<string, string> = {}) =>
  callRoute<CartItem & { error?: string }>(POST, {
    url: '/api/cart',
    method: 'POST',
    body,
    cookies,
  });

const read = (cookies: Record<string, string> = {}) =>
  callRoute<Cart | null>(GET, { url: '/api/cart', cookies });

describe('POST /api/cart', () => {
  it('prices the line from the catalogue, not the request', async () => {
    // The old endpoint took `price` from the body and checked only that it was
    // a number, so anything could be ordered for one rouble.
    const { status, json } = await add({
      productId: PIZZA_ID,
      selectedOptions: validPizzaOptions,
      price: 1,
    });

    expect(status).toBe(200);
    expect(json.price).toBe(PIZZA_BASE_PRICE + PIZZA_SIZE_30_SURCHARGE);

    const stored = await prisma.cartItem.findFirst();
    expect(stored?.price).toBe(PIZZA_BASE_PRICE + PIZZA_SIZE_30_SURCHARGE);
  });

  it('adds every selected surcharge', async () => {
    const { json } = await add({
      productId: PIZZA_ID,
      selectedOptions: {
        [PIZZA_SIZE_OPTION]: [PIZZA_SIZE_30],
        [PIZZA_EXTRA_OPTION]: [PIZZA_EXTRA_CHEESE],
      },
    });

    expect(json.price).toBe(
      PIZZA_BASE_PRICE + PIZZA_SIZE_30_SURCHARGE + PIZZA_EXTRA_CHEESE_SURCHARGE,
    );
  });

  it('issues a guest cookie on the first add', async () => {
    const { setCookies, cookieAttributes } = await add({
      productId: DESSERT_ID,
    });

    expect(setCookies.guestId).toBeTruthy();
    expect(cookieAttributes.guestId).toMatch(/HttpOnly/i);
  });

  it('reuses the existing guest cookie instead of minting another', async () => {
    const { guestId } = await createGuestCart();

    const { setCookies } = await add({ productId: DESSERT_ID }, { guestId });

    expect(setCookies.guestId).toBeUndefined();
    expect(await prisma.cart.count()).toBe(1);
  });

  it('merges a repeat add into one line', async () => {
    const { guestId } = await createGuestCart();

    await add({ productId: DESSERT_ID, quantity: 1 }, { guestId });
    await add({ productId: DESSERT_ID, quantity: 2 }, { guestId });

    const items = await prisma.cartItem.findMany();

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('does not split a line over option ordering', async () => {
    const { guestId } = await createGuestCart();

    const options = [PIZZA_EXTRA_CHEESE, 'pizza-1:extra:champignons'];

    await add(
      {
        productId: PIZZA_ID,
        selectedOptions: {
          [PIZZA_SIZE_OPTION]: [PIZZA_SIZE_30],
          [PIZZA_EXTRA_OPTION]: options,
        },
      },
      { guestId },
    );

    await add(
      {
        productId: PIZZA_ID,
        selectedOptions: {
          [PIZZA_EXTRA_OPTION]: [...options].reverse(),
          [PIZZA_SIZE_OPTION]: [PIZZA_SIZE_30],
        },
      },
      { guestId },
    );

    expect(await prisma.cartItem.count()).toBe(1);
  });

  it('keeps different option choices as separate lines', async () => {
    const { guestId } = await createGuestCart();

    await add(
      { productId: PIZZA_ID, selectedOptions: validPizzaOptions },
      { guestId },
    );
    await add(
      {
        productId: PIZZA_ID,
        selectedOptions: { [PIZZA_SIZE_OPTION]: ['pizza-1:size:35'] },
      },
      { guestId },
    );

    expect(await prisma.cartItem.count()).toBe(2);
  });

  it('writes into the account cart when signed in, ignoring a stale guest cookie', async () => {
    const user = await createUser();
    const { guestId } = await createGuestCart();

    await add({ productId: DESSERT_ID }, { ...user.cookies, guestId });

    const userCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });
    const guestCart = await prisma.cart.findUnique({
      where: { guestId },
      include: { items: true },
    });

    expect(userCart?.items).toHaveLength(1);
    expect(guestCart?.items).toHaveLength(0);
  });

  it('rejects a missing required option', async () => {
    const { status, json } = await add({ productId: PIZZA_ID });

    expect(status).toBe(400);
    expect(json.error).toMatch(/required/i);
  });

  it('rejects an unknown option value', async () => {
    const { status } = await add({
      productId: PIZZA_ID,
      selectedOptions: { [PIZZA_SIZE_OPTION]: ['pizza-1:size:999'] },
    });

    expect(status).toBe(400);
  });

  it('rejects two values for a single-choice option', async () => {
    const { status } = await add({
      productId: PIZZA_ID,
      selectedOptions: {
        [PIZZA_SIZE_OPTION]: [PIZZA_SIZE_30, 'pizza-1:size:35'],
      },
    });

    expect(status).toBe(400);
  });

  it('404s on an unknown product', async () => {
    const { status } = await add({ productId: 'no-such-product' });

    expect(status).toBe(404);
  });

  it('rejects a nonsensical quantity', async () => {
    expect((await add({ productId: DESSERT_ID, quantity: 0 })).status).toBe(400);
    expect((await add({ productId: DESSERT_ID, quantity: -5 })).status).toBe(
      400,
    );
  });

  it('rejects a cross-origin add', async () => {
    const { status } = await callRoute(POST, {
      url: '/api/cart',
      method: 'POST',
      body: { productId: DESSERT_ID },
      origin: 'https://evil.example',
    });

    expect(status).toBe(403);
  });
});

describe('GET /api/cart', () => {
  it('returns null for a visitor with no cart', async () => {
    const { status, json } = await read();

    expect(status).toBe(200);
    expect(json).toBeNull();
  });

  it('returns the guest cart with readable option titles', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id, { quantity: 2 });

    const { json } = await read({ guestId });

    expect(json?.items).toHaveLength(1);
    expect(json?.items[0].quantity).toBe(2);
    // Stored as ids, presented as titles.
    expect(json?.items[0].selectedOptions).toEqual({ Размер: ['30 см'] });
    expect(json?.items[0].product.title).toBe('Пепперони Классик');
  });

  it('prefers the account cart over the guest cookie', async () => {
    const user = await createUser();
    const ownCart = await createUserCart(user.id);
    await addCartItem(ownCart.id, { productId: DESSERT_ID, price: DESSERT_PRICE });

    const { cart: guestCart, guestId } = await createGuestCart();
    await addCartItem(guestCart.id);

    const { json } = await read({ ...user.cookies, guestId });

    expect(json?.items).toHaveLength(1);
    expect(json?.items[0].product.id).toBe(DESSERT_ID);
  });

  it('serialises dates as strings', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { json } = await read({ guestId });

    expect(typeof json?.createdAt).toBe('string');
  });
});
