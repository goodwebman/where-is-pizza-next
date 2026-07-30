import { describe, expect, it } from 'vitest';

import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import { createUser, testPassword } from '@/src/test/integration/fixtures';
import { POST as login } from '../login/route';
import { POST } from './route';

const logout = (cookies: Record<string, string> = {}) =>
  callRoute<{ success: boolean }>(POST, {
    url: '/api/auth/logout',
    method: 'POST',
    cookies,
  });

describe('POST /api/auth/logout', () => {
  it('clears every auth cookie', async () => {
    const user = await createUser();

    const { setCookies: signedIn } = await callRoute(login, {
      url: '/api/auth/login',
      method: 'POST',
      body: { email: user.email, password: testPassword },
    });

    const { status, setCookies } = await logout({ wp_rt: signedIn.wp_rt });

    expect(status).toBe(200);
    expect(setCookies.wp_at).toBe('');
    expect(setCookies.wp_rt).toBe('');
    expect(setCookies.wp_auth).toBe('');
  });

  it('revokes the refresh token server-side', async () => {
    const user = await createUser();

    const { setCookies: signedIn } = await callRoute(login, {
      url: '/api/auth/login',
      method: 'POST',
      body: { email: user.email, password: testPassword },
    });

    await logout({ wp_rt: signedIn.wp_rt });

    const live = await prisma.refreshToken.findMany({
      where: { userId: user.id, revokedAt: null },
    });

    expect(live).toHaveLength(0);
  });

  it('succeeds when there is no session to end', async () => {
    // Logging out of a session that is already gone is a success from the
    // caller's point of view.
    const { status } = await logout();

    expect(status).toBe(200);
  });

  it('ignores an unknown token without erroring', async () => {
    const { status } = await logout({ wp_rt: 'nonsense' });

    expect(status).toBe(200);
  });
});
