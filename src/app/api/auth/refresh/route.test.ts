import { describe, expect, it } from 'vitest';

import { hashRefreshToken } from '@/src/server/auth/tokens';
import { prisma } from '@/src/server/db/prisma';
import type { SessionUser } from '@/src/shared/contracts';
import { callRoute } from '@/src/test/integration/call-route';
import { createUser, testPassword } from '@/src/test/integration/fixtures';
import { POST as login } from '../login/route';
import { POST } from './route';

const refresh = (cookies: Record<string, string>) =>
  callRoute<{ user: SessionUser; error?: string }>(POST, {
    url: '/api/auth/refresh',
    method: 'POST',
    cookies,
  });

const signIn = async () => {
  const user = await createUser();

  const { setCookies } = await callRoute(login, {
    url: '/api/auth/login',
    method: 'POST',
    body: { email: user.email, password: testPassword },
  });

  return { user, refreshToken: setCookies.wp_rt };
};

describe('POST /api/auth/refresh', () => {
  it('exists at all', async () => {
    // The client has always called this endpoint; the old backend only had
    // GET /auth/session, so session restoration never worked.
    const { refreshToken } = await signIn();

    const { status } = await refresh({ wp_rt: refreshToken });

    expect(status).toBe(200);
  });

  it('issues a new token pair', async () => {
    const { user, refreshToken } = await signIn();

    const { json, setCookies } = await refresh({ wp_rt: refreshToken });

    expect(json.user.id).toBe(user.id);
    expect(setCookies.wp_rt).toBeTruthy();
    expect(setCookies.wp_rt).not.toBe(refreshToken);
    expect(setCookies.wp_at).toBeTruthy();
  });

  it('keeps the rotated token inside the same family', async () => {
    const { refreshToken } = await signIn();

    await refresh({ wp_rt: refreshToken });

    const families = await prisma.refreshToken.findMany({
      select: { familyId: true },
    });

    expect(new Set(families.map(f => f.familyId)).size).toBe(1);
  });

  it('401s without a refresh cookie', async () => {
    const { status, json } = await refresh({});

    expect(status).toBe(401);
    expect(json.error).toBeTruthy();
  });

  it('401s on an unknown token', async () => {
    const { status } = await refresh({ wp_rt: 'not-a-real-token' });

    expect(status).toBe(401);
  });

  it('tolerates an immediate second use, for the two-tab case', async () => {
    const { refreshToken } = await signIn();

    const first = await refresh({ wp_rt: refreshToken });
    const second = await refresh({ wp_rt: refreshToken });

    expect(first.status).toBe(200);
    // Within the grace window this is a racing tab, not a stolen token.
    expect(second.status).toBe(200);
  });

  it('burns the whole family when a long-rotated token is replayed', async () => {
    const { user, refreshToken } = await signIn();

    await refresh({ wp_rt: refreshToken });

    // Push the rotation outside the grace window.
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashRefreshToken(refreshToken) },
      data: { rotatedAt: new Date(Date.now() - 10 * 60_000) },
    });

    const { status, setCookies } = await refresh({ wp_rt: refreshToken });

    expect(status).toBe(401);
    // A refusal is terminal: stop the browser retrying with dead cookies.
    expect(setCookies.wp_at).toBe('');
    expect(setCookies.wp_rt).toBe('');

    const live = await prisma.refreshToken.findMany({
      where: { userId: user.id, revokedAt: null },
    });

    expect(live).toHaveLength(0);
  });

  it('refuses a token that was already revoked', async () => {
    const { refreshToken } = await signIn();

    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashRefreshToken(refreshToken) },
      data: { revokedAt: new Date() },
    });

    const { status } = await refresh({ wp_rt: refreshToken });

    expect(status).toBe(401);
  });

  it('refuses an expired token', async () => {
    const { refreshToken } = await signIn();

    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashRefreshToken(refreshToken) },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const { status } = await refresh({ wp_rt: refreshToken });

    expect(status).toBe(401);
  });
});
