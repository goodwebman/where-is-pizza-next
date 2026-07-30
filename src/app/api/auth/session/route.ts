import { NextResponse, type NextRequest } from 'next/server';

import { readSession } from '@/src/server/auth/session';
import { unauthorized } from '@/src/server/http/errors';
import { withRoute } from '@/src/server/http/route';
import { getSessionUser } from '@/src/server/services/auth.service';

/**
 * The client's source of truth for "who am I". A 401 here is the signal to try
 * POST /api/auth/refresh — it does not mean the visitor has no session, only
 * that the 15-minute access token has aged out.
 */
export const GET = withRoute(async (request: NextRequest) => {
  const session = await readSession(request.cookies);
  if (!session) throw unauthorized();

  const user = await getSessionUser(session.userId);
  if (!user) throw unauthorized();

  return NextResponse.json({ user });
});
