import 'server-only';

import { randomUUID } from 'node:crypto';

import { hashPassword, verifyPassword } from '@/src/server/auth/password';
import {
  createRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  signAccessToken,
} from '@/src/server/auth/tokens';
import { prisma, type Db } from '@/src/server/db/prisma';
import { withTransaction } from '@/src/server/db/transaction';
import { conflict, unauthorized } from '@/src/server/http/errors';
import { mergeGuestCart } from '@/src/server/services/cart.service';
import type {
  LoginInput,
  RegisterInput,
  SessionUser,
} from '@/src/shared/contracts';

export type IssuedTokens = { accessToken: string; refreshToken: string };

export type AuthResult = {
  user: SessionUser;
  tokens: IssuedTokens;
  /** True when guest data was folded in, so the caller clears the guest cookie. */
  claimedGuest: boolean;
};

/**
 * Tolerated inside this window, a refresh token that has already been rotated is
 * treated as a legitimate retry rather than theft — two tabs refreshing at once
 * would otherwise log the user out.
 */
const ROTATION_GRACE_MS = 60_000;

const toSessionUser = (user: {
  id: number;
  email: string;
  username: string;
}): SessionUser => ({
  id: user.id,
  email: user.email,
  username: user.username,
});

const issueTokens = async (
  userId: number,
  familyId: string,
  db: Db,
): Promise<IssuedTokens> => {
  const refreshToken = createRefreshToken();

  await db.refreshToken.create({
    data: {
      tokenHash: hashRefreshToken(refreshToken),
      familyId,
      userId,
      expiresAt: refreshTokenExpiry(),
    },
  });

  return {
    accessToken: await signAccessToken({ userId }),
    refreshToken,
  };
};

/**
 * Hands everything the anonymous visitor accumulated to their new account.
 *
 * Orders are claimed by their own `guestId` column rather than through the cart
 * relation: merging deletes the guest cart, and with a real foreign key that
 * would null out `Order.cartId` and orphan the history.
 */
const claimGuestData = async (
  guestId: string,
  userId: number,
  db: Db,
): Promise<void> => {
  await mergeGuestCart(guestId, userId, db);

  await db.order.updateMany({
    where: { guestId },
    data: { userId, guestId: null },
  });
};

/** Opportunistic cleanup — the table would otherwise grow without bound. */
const pruneExpiredTokens = async (userId: number, db: Db) => {
  await db.refreshToken.deleteMany({
    where: { userId, expiresAt: { lt: new Date() } },
  });
};

export const registerUser = async (
  input: RegisterInput,
  guestId: string | undefined,
  db: Db = prisma,
): Promise<AuthResult> =>
  withTransaction(db, async tx => {
    const existing = await tx.user.findFirst({
      where: { OR: [{ email: input.email }, { username: input.username }] },
      select: { email: true, username: true },
    });

    if (existing?.email === input.email) {
      throw conflict('Email already registered', 'EMAIL_TAKEN');
    }
    if (existing) {
      throw conflict('Username already taken', 'USERNAME_TAKEN');
    }

    const user = await tx.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: await hashPassword(input.password),
      },
      select: { id: true, email: true, username: true },
    });

    if (guestId) await claimGuestData(guestId, user.id, tx);

    return {
      user: toSessionUser(user),
      tokens: await issueTokens(user.id, randomUUID(), tx),
      claimedGuest: Boolean(guestId),
    };
  });

export const loginUser = async (
  input: LoginInput,
  guestId: string | undefined,
  db: Db = prisma,
): Promise<AuthResult> =>
  withTransaction(db, async tx => {
    const user = await tx.user.findUnique({ where: { email: input.email } });

    // Same message either way: distinguishing them tells an attacker which
    // emails are registered.
    if (!user || !(await verifyPassword(input.password, user.password))) {
      throw unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    if (guestId) await claimGuestData(guestId, user.id, tx);

    await pruneExpiredTokens(user.id, tx);

    return {
      user: toSessionUser(user),
      tokens: await issueTokens(user.id, randomUUID(), tx),
      claimedGuest: Boolean(guestId),
    };
  });

/**
 * Rotates a refresh token, and treats reuse of an already-rotated one as theft.
 *
 * Rotation happens only here. Doing it in every handler would make two parallel
 * requests race, and the loser would look like a stolen token.
 */
export const rotateSession = async (
  rawToken: string,
  db: Db = prisma,
): Promise<{ user: SessionUser; tokens: IssuedTokens }> => {
  const stored = await db.refreshToken.findUnique({
    where: { tokenHash: hashRefreshToken(rawToken) },
    include: {
      user: { select: { id: true, email: true, username: true } },
    },
  });

  if (!stored) throw unauthorized('Invalid session', 'INVALID_SESSION');

  const now = Date.now();

  const revoked = stored.revokedAt !== null;
  const rotatedTooLongAgo =
    stored.rotatedAt !== null &&
    now - stored.rotatedAt.getTime() > ROTATION_GRACE_MS;

  // Revocation happens outside a transaction on purpose: it is followed by a
  // throw, and inside a transaction the rollback would undo the very revocation
  // the throw is reporting.
  if (revoked || rotatedTooLongAgo) {
    await db.refreshToken.updateMany({
      where: { familyId: stored.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    throw unauthorized('Session reuse detected', 'SESSION_REUSE');
  }

  if (stored.expiresAt.getTime() < now) {
    throw unauthorized('Session expired', 'SESSION_EXPIRED');
  }

  // Marking the old token rotated and minting its replacement must be atomic:
  // a crash in between would either invalidate a session that got no successor,
  // or leave an unrotated token that a later reuse check would trust.
  return withTransaction(db, async tx => {
    if (stored.rotatedAt === null) {
      await tx.refreshToken.update({
        where: { id: stored.id },
        data: { rotatedAt: new Date() },
      });
    }

    return {
      user: toSessionUser(stored.user),
      tokens: await issueTokens(stored.userId, stored.familyId, tx),
    };
  });
};

export const revokeSession = async (
  rawToken: string | undefined,
  db: Db = prisma,
): Promise<void> => {
  if (!rawToken) return;

  const tokenHash = hashRefreshToken(rawToken);
  const stored = await db.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored) return;

  // Log out every token issued from this login, not just the one presented.
  await db.refreshToken.updateMany({
    where: { familyId: stored.familyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

export const revokeAllSessions = async (userId: number, db: Db = prisma) => {
  await db.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

export const getSessionUser = async (
  userId: number,
  db: Db = prisma,
): Promise<SessionUser | null> => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true },
  });

  return user ? toSessionUser(user) : null;
};
