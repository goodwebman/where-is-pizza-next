import { NextResponse, type NextRequest } from 'next/server';

import { clearGuestCookie, setAuthCookies } from '@/src/server/auth/cookies';
import { readActor } from '@/src/server/auth/session';
import { readJson, withRoute } from '@/src/server/http/route';
import { registerUser } from '@/src/server/services/auth.service';
import { registerSchema } from '@/src/shared/contracts';

export const POST = withRoute(async (request: NextRequest) => {
  const input = registerSchema.parse(await readJson(request));
  const { guestId } = await readActor(request);

  const { user, tokens, claimedGuest } = await registerUser(input, guestId);

  const response = NextResponse.json({ user });
  setAuthCookies(response.cookies, tokens);

  // The guest cart and orders now belong to the account; leaving the cookie
  // would start building a second, anonymous cart underneath the user.
  if (claimedGuest) clearGuestCookie(response.cookies);

  return response;
});
