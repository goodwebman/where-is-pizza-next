import { NextResponse, type NextRequest } from 'next/server';

import { REFRESH_COOKIE, clearAuthCookies } from '@/src/server/auth/cookies';
import { withRoute } from '@/src/server/http/route';
import { revokeSession } from '@/src/server/services/auth.service';

export const POST = withRoute(async (request: NextRequest) => {
  await revokeSession(request.cookies.get(REFRESH_COOKIE)?.value);

  // Always 200: logging out of a session that is already gone is a success from
  // the caller's point of view.
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response.cookies);

  return response;
});
