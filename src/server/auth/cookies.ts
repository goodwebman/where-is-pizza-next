import 'server-only';

import type { NextResponse } from 'next/server';

import { isProduction } from '@/src/server/config/env';
import { REFRESH_TOKEN_TTL_MS } from './tokens';

export const ACCESS_COOKIE = 'wp_at';
export const REFRESH_COOKIE = 'wp_rt';
/**
 * Readable by JS on purpose: it lets the client skip a session request for
 * visitors who were never logged in. It is a hint, never an authorisation
 * decision — the server only ever trusts the httpOnly pair above.
 */
export const AUTH_MARKER_COOKIE = 'wp_auth';
export const GUEST_COOKIE = 'guestId';

const GUEST_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const baseOptions = {
  httpOnly: true,
  secure: isProduction,
  // Lax is enough now that the API is same-origin, and it is what stops
  // cross-site requests from carrying credentials in the first place.
  sameSite: 'lax',
  path: '/',
} as const;

type Cookies = NextResponse['cookies'];

export const setAuthCookies = (
  cookies: Cookies,
  tokens: { accessToken: string; refreshToken: string },
): void => {
  cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...baseOptions,
    // Deliberately not tied to the 15-minute token lifetime: the cookie should
    // outlive the token so the client still sends it and gets a 401 it can
    // refresh from, instead of the cookie vanishing and looking like a logout.
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  });

  cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...baseOptions,
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  });

  cookies.set(AUTH_MARKER_COOKIE, '1', {
    ...baseOptions,
    httpOnly: false,
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  });
};

export const clearAuthCookies = (cookies: Cookies): void => {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, AUTH_MARKER_COOKIE]) {
    cookies.set(name, '', { ...baseOptions, httpOnly: name !== AUTH_MARKER_COOKIE, maxAge: 0 });
  }
};

export const setGuestCookie = (cookies: Cookies, guestId: string): void => {
  cookies.set(GUEST_COOKIE, guestId, {
    ...baseOptions,
    maxAge: GUEST_TTL_MS / 1000,
  });
};

/**
 * Cleared once a guest's cart and orders have been claimed by an account —
 * otherwise the stale cookie keeps creating fresh guest carts underneath a
 * logged-in user, which is exactly what the old code did.
 */
export const clearGuestCookie = (cookies: Cookies): void => {
  cookies.set(GUEST_COOKIE, '', { ...baseOptions, maxAge: 0 });
};
