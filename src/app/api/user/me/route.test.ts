import { describe, expect, it } from 'vitest';

import type { User } from '@/src/entities/user/model/types';
import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import { createUser } from '@/src/test/integration/fixtures';
import { GET } from './route';

const me = (cookies: Record<string, string> = {}) =>
  callRoute<User & { error?: string }>(GET, { url: '/api/user/me', cookies });

describe('GET /api/user/me', () => {
  it('returns the profile', async () => {
    const user = await createUser();
    await prisma.user.update({
      where: { id: user.id },
      data: { phone: '89001112233', birthDate: new Date('1990-05-17') },
    });

    const { status, json } = await me(user.cookies);

    expect(status).toBe(200);
    expect(json.email).toBe(user.email);
    expect(json.phone).toBe('89001112233');
    // ISO string so the server-rendered value and a client refetch agree.
    expect(json.birthDate).toBe('1990-05-17T00:00:00.000Z');
  });

  it('401s without a session', async () => {
    // Cart and order endpoints aside, these were the only routes with any auth
    // at all — and they read a header the client stopped sending.
    const { status } = await me();

    expect(status).toBe(401);
  });

  it('401s on a forged token', async () => {
    const { status } = await me({ wp_at: 'not.a.token' });

    expect(status).toBe(401);
  });

  it('never returns the password hash', async () => {
    const user = await createUser();

    const { json } = await me(user.cookies);

    expect(json).not.toHaveProperty('password');
  });
});
