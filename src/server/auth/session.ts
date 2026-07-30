import 'server-only';

import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { unauthorized } from '@/src/server/http/errors';
import { ACCESS_COOKIE, GUEST_COOKIE } from './cookies';
import { verifyAccessToken } from './tokens';

export type Session = { userId: number };

/**
 * Who is making this request, as far as the API is concerned.
 *
 * `userId` comes from a signed access token; `guestId` is an opaque cookie that
 * only ever addresses anonymous carts and orders. Both can be present — a user
 * who logged in during this session still carries the guest cookie until it is
 * claimed.
 */
export type RequestActor = {
  userId?: number;
  guestId?: string;
};

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

export const readSession = async (
  jar: CookieReader,
): Promise<Session | null> => {
  const token = jar.get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  return payload ? { userId: payload.userId } : null;
};

/**
 * Route handlers read cookies off the request rather than via `next/headers`,
 * which keeps them callable from tests with a plain constructed NextRequest.
 */
export const readActor = async (
  request: NextRequest,
): Promise<RequestActor> => {
  const session = await readSession(request.cookies);

  return {
    userId: session?.userId,
    guestId: request.cookies.get(GUEST_COOKIE)?.value || undefined,
  };
};

export const requireUserId = async (request: NextRequest): Promise<number> => {
  const session = await readSession(request.cookies);
  if (!session) throw unauthorized();

  return session.userId;
};

/**
 * For Server Components only. Reading cookies here makes the segment dynamic,
 * so it must never be called from the root layout — that would silently drop
 * ISR on the home page.
 */
export const getServerSession = async (): Promise<Session | null> =>
  readSession(await cookies());
