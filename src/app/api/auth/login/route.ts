import { NextResponse, type NextRequest } from 'next/server';

import { clearGuestCookie, setAuthCookies } from '@/src/server/auth/cookies';
import { readActor } from '@/src/server/auth/session';
import { readJson, withRoute } from '@/src/server/http/route';
import { loginUser } from '@/src/server/services/auth.service';
import { loginSchema } from '@/src/shared/contracts';

export const POST = withRoute(async (request: NextRequest) => {
  const input = loginSchema.parse(await readJson(request));
  const { guestId } = await readActor(request);

  const { user, tokens, claimedGuest } = await loginUser(input, guestId);

  const response = NextResponse.json({ user });
  setAuthCookies(response.cookies, tokens);

  if (claimedGuest) clearGuestCookie(response.cookies);

  return response;
});
