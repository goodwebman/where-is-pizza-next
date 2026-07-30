import { NextResponse, type NextRequest } from 'next/server';

import {
  REFRESH_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from '@/src/server/auth/cookies';
import { unauthorized } from '@/src/server/http/errors';
import { withRoute } from '@/src/server/http/route';
import { rotateSession } from '@/src/server/services/auth.service';

/**
 * The endpoint the client has always called and the server never had — the old
 * backend only exposed `GET /auth/session`, so session restoration was broken
 * end to end.
 *
 * This is the single place refresh tokens rotate.
 */
export const POST = withRoute(async (request: NextRequest) => {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) throw unauthorized('No session', 'NO_SESSION');

  try {
    const { user, tokens } = await rotateSession(refreshToken);

    const response = NextResponse.json({ user });
    setAuthCookies(response.cookies, tokens);

    return response;
  } catch (error) {
    // A refusal here is terminal: clear the cookies so the browser stops
    // retrying with a token that will never work again.
    const response = NextResponse.json(
      { error: 'Invalid session', code: 'INVALID_SESSION' },
      { status: 401 },
    );
    clearAuthCookies(response.cookies);

    if (process.env.NODE_ENV !== 'production') {
      console.warn('[auth/refresh]', (error as Error).message);
    }

    return response;
  }
});
