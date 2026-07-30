import { describe, expect, it } from 'vitest';

import { verifyPassword } from '@/src/server/auth/password';
import { prisma } from '@/src/server/db/prisma';
import { callRoute } from '@/src/test/integration/call-route';
import { createUser, testPassword } from '@/src/test/integration/fixtures';
import { POST as login } from '../../auth/login/route';
import { PATCH } from './route';

const change = (
  body: Record<string, unknown>,
  cookies: Record<string, string> = {},
) =>
  callRoute<{ success?: boolean; error?: string }>(PATCH, {
    url: '/api/user/password',
    method: 'PATCH',
    body,
    cookies,
  });

describe('PATCH /api/user/password', () => {
  it('changes the password', async () => {
    const user = await createUser();

    const { status } = await change(
      { currentPassword: testPassword, newPassword: 'brand-new-password' },
      user.cookies,
    );

    expect(status).toBe(200);

    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(await verifyPassword('brand-new-password', stored!.password)).toBe(
      true,
    );
  });

  it('401s without a session', async () => {
    const { status } = await change({
      currentPassword: testPassword,
      newPassword: 'brand-new-password',
    });

    expect(status).toBe(401);
  });

  it('400s on a wrong current password', async () => {
    const user = await createUser();

    const { status, json } = await change(
      { currentPassword: 'not-my-password', newPassword: 'brand-new-password' },
      user.cookies,
    );

    expect(status).toBe(400);
    expect(json.error).toBe('Current password incorrect');
  });

  it('400s when the new password equals the old one', async () => {
    const user = await createUser();

    const { status } = await change(
      { currentPassword: testPassword, newPassword: testPassword },
      user.cookies,
    );

    expect(status).toBe(400);
  });

  it('400s on a too-short new password', async () => {
    const user = await createUser();

    const { status } = await change(
      { currentPassword: testPassword, newPassword: '123' },
      user.cookies,
    );

    expect(status).toBe(400);
  });

  it('revokes every session and clears this one\'s cookies', async () => {
    const user = await createUser();

    await callRoute(login, {
      url: '/api/auth/login',
      method: 'POST',
      body: { email: user.email, password: testPassword },
    });

    const { setCookies } = await change(
      { currentPassword: testPassword, newPassword: 'brand-new-password' },
      user.cookies,
    );

    const live = await prisma.refreshToken.findMany({
      where: { userId: user.id, revokedAt: null },
    });

    expect(live).toHaveLength(0);
    expect(setCookies.wp_at).toBe('');
    expect(setCookies.wp_rt).toBe('');
  });

  it('leaves the old password working if the change is rejected', async () => {
    const user = await createUser();

    await change(
      { currentPassword: 'wrong', newPassword: 'brand-new-password' },
      user.cookies,
    );

    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(await verifyPassword(testPassword, stored!.password)).toBe(true);
  });
});
