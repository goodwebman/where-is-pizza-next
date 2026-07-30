import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';

import { env } from '@/src/server/config/env';

/**
 * 15 minutes, expressed the way jose reads it. The hand-rolled implementation
 * this replaces wrote `15 * 60 * 60` under a comment claiming "15 minutes" —
 * seconds vs hours, so every access token lived 15 hours.
 */
export const ACCESS_TOKEN_TTL = '15m';

/** 30 days, in milliseconds — used both for the DB expiry and the cookie maxAge. */
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const ISSUER = 'where-is-pizza';
const TOKEN_TYPE = 'access';

const signingKey = new TextEncoder().encode(env.JWT_SECRET);

export type AccessTokenPayload = { userId: number };

export const signAccessToken = async (
  payload: AccessTokenPayload,
): Promise<string> =>
  new SignJWT({ tokenType: TOKEN_TYPE })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(payload.userId))
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(signingKey);

/**
 * Returns null for anything that is not a currently valid access token.
 *
 * jose checks the signature with WebCrypto (constant-time) and validates `exp`
 * and `iss` itself. The previous implementation compared signatures with `===`,
 * never checked the token type, and exposed a `getPayload` that decoded without
 * verifying at all.
 */
export const verifyAccessToken = async (
  token: string,
): Promise<AccessTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, signingKey, {
      issuer: ISSUER,
      algorithms: ['HS256'],
    });

    if (payload.tokenType !== TOKEN_TYPE) return null;

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId <= 0) return null;

    return { userId };
  } catch {
    return null;
  }
};

/**
 * Refresh tokens are opaque random strings, not JWTs: they must be revocable,
 * which means a database lookup on every use anyway.
 */
export const createRefreshToken = (): string =>
  randomBytes(32).toString('base64url');

/**
 * Only the hash is stored. A dump of the RefreshToken table then contains
 * nothing that can be replayed as a session.
 */
export const hashRefreshToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const refreshTokenExpiry = (from: Date = new Date()): Date =>
  new Date(from.getTime() + REFRESH_TOKEN_TTL_MS);
