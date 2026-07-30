import { describe, expect, it } from 'vitest';

import type { User } from '@/src/entities/user/model/types';
import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import { createUser } from '@/src/test/integration/fixtures';
import { PATCH } from './route';

const update = (
  body: Record<string, unknown>,
  cookies: Record<string, string> = {},
) =>
  callRoute<User & { error?: string }>(PATCH, {
    url: '/api/user/profile',
    method: 'PATCH',
    body,
    cookies,
  });

describe('PATCH /api/user/profile', () => {
  it('updates the fields it is given', async () => {
    const user = await createUser();

    const { status, json } = await update(
      { username: 'Пётр', phone: '89001112233' },
      user.cookies,
    );

    expect(status).toBe(200);
    expect(json.username).toBe('Пётр');
    expect(json.phone).toBe('89001112233');
    // Untouched fields stay as they were.
    expect(json.email).toBe(user.email);
  });

  it('401s without a session', async () => {
    const { status } = await update({ username: 'Пётр' });

    expect(status).toBe(401);
  });

  it('409s on an email already in use', async () => {
    const user = await createUser();
    const other = await createUser();

    const { status, json } = await update({ email: other.email }, user.cookies);

    expect(status).toBe(409);
    expect(json.error).toBe('Email already in use');
  });

  it('409s on a username already taken', async () => {
    const user = await createUser();
    const other = await createUser();

    const { status } = await update({ username: other.username }, user.cookies);

    expect(status).toBe(409);
  });

  it('409s on a phone already in use', async () => {
    const user = await createUser();
    const other = await createUser();
    await prisma.user.update({
      where: { id: other.id },
      data: { phone: '89001112233' },
    });

    const { status } = await update({ phone: '89001112233' }, user.cookies);

    expect(status).toBe(409);
  });

  it('lets a user resubmit their own unchanged values', async () => {
    const user = await createUser();

    const { status } = await update(
      { email: user.email, username: user.username },
      user.cookies,
    );

    expect(status).toBe(200);
  });

  it('rejects a malformed phone', async () => {
    const user = await createUser();

    const { status } = await update({ phone: '12345' }, user.cookies);

    expect(status).toBe(400);
  });

  it('rejects an empty update', async () => {
    const user = await createUser();

    const { status } = await update({}, user.cookies);

    expect(status).toBe(400);
  });
});
