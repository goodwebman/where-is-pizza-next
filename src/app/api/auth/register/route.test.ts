import { describe, expect, it } from 'vitest';

import { prisma } from '@/src/server/db/prisma';
import type { SessionUser } from '@/src/shared/contracts';
import {
  PIZZA_ID,
  addCartItem,
  createGuestCart,
  createUser,
} from '@/src/test/integration/fixtures';
import { callRoute } from '@/src/test/integration/call-route';
import { POST } from './route';

const register = (
  body: Record<string, unknown>,
  cookies: Record<string, string> = {},
) =>
  callRoute<{ user: SessionUser } & { error?: string }>(POST, {
    url: '/api/auth/register',
    method: 'POST',
    body,
    cookies,
  });

const validBody = {
  email: 'new@example.com',
  username: 'newcomer',
  password: 'password123',
};

describe('POST /api/auth/register', () => {
  it('creates an account and issues session cookies', async () => {
    const { status, json, setCookies, cookieAttributes } =
      await register(validBody);

    expect(status).toBe(200);
    expect(json.user).toMatchObject({
      email: 'new@example.com',
      username: 'newcomer',
    });

    expect(setCookies.wp_at).toBeTruthy();
    expect(setCookies.wp_rt).toBeTruthy();
    expect(setCookies.wp_auth).toBe('1');

    // The token pair must be unreachable from JavaScript; the marker must not.
    expect(cookieAttributes.wp_at).toMatch(/HttpOnly/i);
    expect(cookieAttributes.wp_rt).toMatch(/HttpOnly/i);
    expect(cookieAttributes.wp_auth).not.toMatch(/HttpOnly/i);
  });

  it('never returns a token in the body', async () => {
    const { json } = await register(validBody);

    expect(json).not.toHaveProperty('token');
    expect(JSON.stringify(json)).not.toContain('eyJ');
  });

  it('stores the password hashed', async () => {
    await register(validBody);

    const user = await prisma.user.findUnique({
      where: { email: 'new@example.com' },
    });

    expect(user?.password).not.toBe('password123');
    expect(user?.password).toMatch(/^\$2[aby]\$/);
  });

  it('stores only a hash of the refresh token', async () => {
    const { setCookies } = await register(validBody);

    const stored = await prisma.refreshToken.findMany();

    expect(stored).toHaveLength(1);
    expect(stored[0].tokenHash).not.toBe(setCookies.wp_rt);
    expect(stored[0].tokenHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('rejects a duplicate email with 409', async () => {
    await createUser({ email: 'taken@example.com' });

    const { status, json } = await register({
      ...validBody,
      email: 'taken@example.com',
    });

    expect(status).toBe(409);
    expect(json.error).toBe('Email already registered');
  });

  it('treats email case as the same account', async () => {
    await createUser({ email: 'taken@example.com' });

    const { status } = await register({
      ...validBody,
      email: 'TAKEN@Example.com',
    });

    expect(status).toBe(409);
  });

  it('rejects a duplicate username with 409', async () => {
    await createUser({ username: 'taken' });

    const { status, json } = await register({
      ...validBody,
      username: 'taken',
    });

    expect(status).toBe(409);
    expect(json.error).toBe('Username already taken');
  });

  it('rejects a short password with 400', async () => {
    const { status } = await register({ ...validBody, password: '123' });

    expect(status).toBe(400);
  });

  it('rejects a malformed email with 400', async () => {
    const { status } = await register({ ...validBody, email: 'nope' });

    expect(status).toBe(400);
  });

  it('claims the guest cart and clears the guest cookie', async () => {
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id, { quantity: 2 });

    const { setCookies } = await register(validBody, { guestId });

    const user = await prisma.user.findUnique({
      where: { email: 'new@example.com' },
      include: { cart: { include: { items: true } } },
    });

    expect(user?.cart?.items).toHaveLength(1);
    expect(user?.cart?.items[0].quantity).toBe(2);
    expect(user?.cart?.guestId).toBeNull();

    // Left in place, the stale cookie would start building a second anonymous
    // cart underneath the logged-in user.
    expect(setCookies.guestId).toBe('');
  });

  it('claims orders the guest placed before signing up', async () => {
    const { guestId } = await createGuestCart();

    const order = await prisma.order.create({
      data: {
        guestId,
        fullPrice: 500,
        name: 'Гость',
        phone: '89000000000',
        email: 'guest@example.com',
        deliveryMode: 'Delivery',
        deliveryTime: 'ASAP',
        paymentMethod: 'Cash',
        changeMethod: 'WithoutChange',
        items: {
          create: {
            productId: PIZZA_ID,
            title: 'Пепперони Классик',
            imageSrc: '/images/pizzas/pizza1.png',
            price: 500,
            quantity: 1,
            ingredients: [],
            selectedOptions: {},
          },
        },
      },
    });

    await register(validBody, { guestId });

    const claimed = await prisma.order.findUnique({ where: { id: order.id } });
    const user = await prisma.user.findUnique({
      where: { email: 'new@example.com' },
    });

    expect(claimed?.userId).toBe(user?.id);
    expect(claimed?.guestId).toBeNull();
  });

  it('registers fine with no guest cookie at all', async () => {
    const { status, setCookies } = await register(validBody);

    expect(status).toBe(200);
    expect(setCookies.guestId).toBeUndefined();
  });

  it('rejects a cross-origin request', async () => {
    const { status } = await callRoute(POST, {
      url: '/api/auth/register',
      method: 'POST',
      body: validBody,
      origin: 'https://evil.example',
    });

    expect(status).toBe(403);
  });

  it('leaves no user behind when registration fails', async () => {
    await createUser({ email: 'taken@example.com' });

    await register({ ...validBody, email: 'taken@example.com' });

    expect(await prisma.user.count()).toBe(1);
    expect(await prisma.refreshToken.count()).toBe(0);
  });
});
