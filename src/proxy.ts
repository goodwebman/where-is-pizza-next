import { NextResponse, type NextRequest } from 'next/server';

import { ROUTES } from '@/src/shared/config';

const ACCESS_COOKIE = 'wp_at';
const REFRESH_COOKIE = 'wp_rt';

/**
 * Cheap pre-filter for protected pages: bounce visitors carrying no session
 * cookie at all, before rendering anything. (Named `proxy` because Next 16
 * renamed the middleware convention.)
 *
 * It deliberately does not verify the signature. This runs on the Edge runtime,
 * where the real check would mean shipping crypto and a database round-trip into
 * every navigation; the profile layout does the authoritative check server-side.
 * Forging these cookies buys you a redirect one step later and nothing else.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie =
    request.cookies.has(ACCESS_COOKIE) || request.cookies.has(REFRESH_COOKIE);

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
};
