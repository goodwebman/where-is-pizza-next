import { describe, expect, it } from 'vitest';

import { prisma } from '@/src/server/db/prisma';
import type { SessionUser } from '@/src/shared/contracts';
import { callRoute } from '@/src/test/integration/call-route';
import {
  addCartItem,
  createGuestCart,
  createUser,
  createUserCart,
  testPassword,
  validPizzaOptions,
} from '@/src/test/integration/fixtures';
import { POST } from './route';

const login = (
  body: Record<string, unknown>,
  cookies: Record<string, string> = {},
) =>
  callRoute<{ user: SessionUser; error?: string }>(POST, {
    url: '/api/auth/login',
    method: 'POST',
    body,
    cookies,
  });

describe('POST /api/auth/login', () => {
  it('signs in with correct credentials', async () => {
    const user = await createUser();

    const { status, json, setCookies } = await login({
      email: user.email,
      password: testPassword,
    });

    expect(status).toBe(200);
    expect(json.user.id).toBe(user.id);
    expect(setCookies.wp_at).toBeTruthy();
    expect(setCookies.wp_rt).toBeTruthy();
  });

  it('rejects a wrong password with 401', async () => {
    const user = await createUser();

    const { status, json, setCookies } = await login({
      email: user.email,
      password: 'wrong-password',
    });

    expect(status).toBe(401);
    expect(json.error).toBe('Invalid credentials');
    expect(setCookies.wp_at).toBeUndefined();
  });

  it('gives the same answer for an unknown email', async () => {
    // Distinguishing the two would let anyone enumerate registered addresses.
    const { status, json } = await login({
      email: 'nobody@example.com',
      password: 'whatever',
    });

    expect(status).toBe(401);
    expect(json.error).toBe('Invalid credentials');
  });

  it('accepts a differently-cased email', async () => {
    const user = await createUser({ email: 'person@example.com' });

    const { status, json } = await login({
      email: 'Person@Example.COM',
      password: testPassword,
    });

    expect(status).toBe(200);
    expect(json.user.id).toBe(user.id);
  });

  it('hands a guest cart to the account when the user has none', async () => {
    const user = await createUser();
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id, { quantity: 3 });

    await login({ email: user.email, password: testPassword }, { guestId });

    const userCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    expect(userCart?.items).toHaveLength(1);
    expect(userCart?.items[0].quantity).toBe(3);
  });

  it('sums quantities when both carts hold the same line', async () => {
    const user = await createUser();
    const ownCart = await createUserCart(user.id);
    await addCartItem(ownCart.id, { quantity: 2 });

    const { cart: guestCart, guestId } = await createGuestCart();
    await addCartItem(guestCart.id, { quantity: 3 });

    await login({ email: user.email, password: testPassword }, { guestId });

    const merged = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    expect(merged?.items).toHaveLength(1);
    expect(merged?.items[0].quantity).toBe(5);
  });

  it('keeps differently-configured lines separate', async () => {
    const user = await createUser();
    const ownCart = await createUserCart(user.id);
    await addCartItem(ownCart.id, {
      selectedOptions: { 'pizza-1:size': ['pizza-1:size:35'] },
    });

    const { cart: guestCart, guestId } = await createGuestCart();
    await addCartItem(guestCart.id, { selectedOptions: validPizzaOptions });

    await login({ email: user.email, password: testPassword }, { guestId });

    const merged = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    expect(merged?.items).toHaveLength(2);
  });

  it('deletes the guest cart and clears its cookie', async () => {
    const user = await createUser();
    const { cart, guestId } = await createGuestCart();
    await addCartItem(cart.id);

    const { setCookies } = await login(
      { email: user.email, password: testPassword },
      { guestId },
    );

    expect(await prisma.cart.findUnique({ where: { guestId } })).toBeNull();
    expect(setCookies.guestId).toBe('');
  });

  it('starts a fresh token family per login', async () => {
    const user = await createUser();

    await login({ email: user.email, password: testPassword });
    await login({ email: user.email, password: testPassword });

    const tokens = await prisma.refreshToken.findMany({
      where: { userId: user.id },
    });

    expect(tokens).toHaveLength(2);
    expect(new Set(tokens.map(t => t.familyId)).size).toBe(2);
  });

  it('prunes expired refresh tokens on the way through', async () => {
    const user = await createUser();

    await prisma.refreshToken.create({
      data: {
        tokenHash: 'a'.repeat(64),
        familyId: 'old-family',
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await login({ email: user.email, password: testPassword });

    const remaining = await prisma.refreshToken.findMany({
      where: { userId: user.id },
    });

    expect(remaining).toHaveLength(1);
    expect(remaining[0].familyId).not.toBe('old-family');
  });
});
