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
 * Requests without an Origin header pass: server-to-server callers and some
 * same-origin navigations legitimately omit it, and they cannot be a browser
 * cross-site attack, which is the only thing this guards against.
 */
export const assertSameOrigin = (request: NextRequest): void => {
  if (!MUTATING_METHODS.has(request.method)) return;

  const origin = request.headers.get('origin');
  if (!origin) return;

  if (origin !== env.SITE_URL) {
    throw forbidden('Cross-origin request rejected', 'BAD_ORIGIN');
  }
};
