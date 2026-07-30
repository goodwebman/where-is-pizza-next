import { describe, expect, it } from 'vitest';

import { signAccessToken } from '@/src/server/auth/tokens';
import { prisma } from '@/src/server/db/prisma';
import type { SessionUser } from '@/src/shared/contracts';
import { callRoute } from '@/src/test/integration/call-route';
import { createUser } from '@/src/test/integration/fixtures';
import { GET } from './route';

const getSession = (cookies: Record<string, string> = {}) =>
  callRoute<{ user: SessionUser; error?: string }>(GET, {
    url: '/api/auth/session',
    cookies,
  });

describe('GET /api/auth/session', () => {
  it('returns the current user', async () => {
    const user = await createUser();

    const { status, json } = await getSession(user.cookies);

    expect(status).toBe(200);
    expect(json.user).toEqual({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  });

  it('never leaks the password hash', async () => {
    const user = await createUser();

    const { json } = await getSession(user.cookies);

    expect(JSON.stringify(json)).not.toContain('$2');
    expect(json.user).not.toHaveProperty('password');
  });

  it('401s without cookies', async () => {
    const { status } = await getSession();

    expect(status).toBe(401);
  });

  it('401s on a forged access token', async () => {
    const { status } = await getSession({ wp_at: 'a.b.c' });

    expect(status).toBe(401);
  });

  it('401s once the user is gone', async () => {
    const user = await createUser();
    await prisma.user.delete({ where: { id: user.id } });

    const { status } = await getSession(user.cookies);

    expect(status).toBe(401);
  });

  it('401s on a token for a user id that never existed', async () => {
    const orphan = await signAccessToken({ userId: 999_999 });

    const { status } = await getSession({ wp_at: orphan });

    expect(status).toBe(401);
  });
});
