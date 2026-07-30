import { SignJWT } from 'jose';
import { describe, expect, it } from 'vitest';

import {
  createRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  signAccessToken,
  verifyAccessToken,
} from './tokens';

const signingKey = () => new TextEncoder().encode(process.env.JWT_SECRET!);

describe('access tokens', () => {
  it('round-trips a user id', async () => {
    const token = await signAccessToken({ userId: 42 });

    expect(await verifyAccessToken(token)).toEqual({ userId: 42 });
  });

  it('lives for 15 minutes', async () => {
    // Regression guard: the hand-rolled version used `15 * 60 * 60` under a
    // comment saying "15 minutes", giving every token a 15-hour lifetime.
    const token = await signAccessToken({ userId: 1 });
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString(),
    ) as { iat: number; exp: number };

    expect(payload.exp - payload.iat).toBe(15 * 60);
  });

  it('rejects an expired token', async () => {
    const expired = await new SignJWT({ tokenType: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('1')
      .setIssuer('where-is-pizza')
      .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(signingKey());

    expect(await verifyAccessToken(expired)).toBeNull();
  });

  it('rejects a tampered signature', async () => {
    const token = await signAccessToken({ userId: 42 });
    const [header, payload] = token.split('.');
    const forged = `${header}.${payload}.${'a'.repeat(43)}`;

    expect(await verifyAccessToken(forged)).toBeNull();
  });

  it('rejects a payload edited without re-signing', async () => {
    const token = await signAccessToken({ userId: 42 });
    const [header, , signature] = token.split('.');
    const forgedPayload = Buffer.from(
      JSON.stringify({ sub: '1', tokenType: 'access', iss: 'where-is-pizza' }),
    ).toString('base64url');

    expect(
      await verifyAccessToken(`${header}.${forgedPayload}.${signature}`),
    ).toBeNull();
  });

  it('rejects a token signed with another key', async () => {
    const foreign = await new SignJWT({ tokenType: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('1')
      .setIssuer('where-is-pizza')
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode('a-different-secret'.padEnd(48, 'x')));

    expect(await verifyAccessToken(foreign)).toBeNull();
  });

  it('rejects another issuer', async () => {
    const foreign = await new SignJWT({ tokenType: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('1')
      .setIssuer('somewhere-else')
      .setExpirationTime('15m')
      .sign(signingKey());

    expect(await verifyAccessToken(foreign)).toBeNull();
  });

  it('rejects a correctly signed token of the wrong type', async () => {
    const refreshShaped = await new SignJWT({ tokenType: 'refresh' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('1')
      .setIssuer('where-is-pizza')
      .setExpirationTime('15m')
      .sign(signingKey());

    expect(await verifyAccessToken(refreshShaped)).toBeNull();
  });

  it('rejects a non-numeric subject', async () => {
    const weird = await new SignJWT({ tokenType: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('not-a-number')
      .setIssuer('where-is-pizza')
      .setExpirationTime('15m')
      .sign(signingKey());

    expect(await verifyAccessToken(weird)).toBeNull();
  });

  it('rejects garbage without throwing', async () => {
    expect(await verifyAccessToken('')).toBeNull();
    expect(await verifyAccessToken('a.b.c')).toBeNull();
  });
});

describe('refresh tokens', () => {
  it('generates a distinct token every call', () => {
    const tokens = new Set(
      Array.from({ length: 50 }, () => createRefreshToken()),
    );

    expect(tokens.size).toBe(50);
  });

  it('hashes deterministically and irreversibly', () => {
    const token = createRefreshToken();
    const hash = hashRefreshToken(token);

    expect(hash).toBe(hashRefreshToken(token));
    expect(hash).not.toBe(token);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('expires 30 days out', () => {
    const from = new Date('2026-01-01T00:00:00.000Z');

    expect(refreshTokenExpiry(from).toISOString()).toBe(
      '2026-01-31T00:00:00.000Z',
    );
  });
});
