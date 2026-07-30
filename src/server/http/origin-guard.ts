import 'server-only';

import type { NextRequest } from 'next/server';

import { env } from '@/src/server/config/env';
import { forbidden } from './errors';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Defence in depth behind SameSite=Lax cookies, which already stop cross-site
 * form posts from carrying credentials. A CSRF token would add nothing on top
 * of a same-origin-only API with lax cookies.
 *
 * The request's own origin is the source of truth, not a configured domain:
 * every Vercel preview gets a fresh hostname, and pinning this to one URL would
 * turn every mutation on a preview deployment into a 403. SITE_URL stays
 * allowed as well, which covers a custom domain fronting the deployment.
 *
 * Requests without an Origin header pass: server-to-server callers and some
 * same-origin navigations legitimately omit it, and they cannot be the browser
 * cross-site attack this guards against.
 */
export const assertSameOrigin = (request: NextRequest): void => {
  if (!MUTATING_METHODS.has(request.method)) return;

  const origin = request.headers.get('origin');
  if (!origin) return;

  const allowed = new Set([request.nextUrl.origin, env.SITE_URL]);

  if (!allowed.has(origin)) {
    throw forbidden('Cross-origin request rejected', 'BAD_ORIGIN');
  }
};
