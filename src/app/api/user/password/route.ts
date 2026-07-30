import { NextResponse, type NextRequest } from 'next/server';

import { clearAuthCookies } from '@/src/server/auth/cookies';
import { requireUserId } from '@/src/server/auth/session';
import { readJson, withRoute } from '@/src/server/http/route';
import { changePassword } from '@/src/server/services/user.service';
import { changePasswordSchema } from '@/src/shared/contracts';

export const PATCH = withRoute(async (request: NextRequest) => {
  const userId = await requireUserId(request);
  const input = changePasswordSchema.parse(await readJson(request));

  await changePassword(userId, input);

  const response = NextResponse.json({ success: true });

  // Changing the password revokes every session, including this one. Clearing
  // the cookies here means the user is asked to sign in again rather than
  // silently 401-ing on the next request.
  clearAuthCookies(response.cookies);

  return response;
});
