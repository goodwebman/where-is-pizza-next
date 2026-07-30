import { NextResponse, type NextRequest } from 'next/server';

import { requireUserId } from '@/src/server/auth/session';
import { withRoute } from '@/src/server/http/route';
import { getProfile } from '@/src/server/services/user.service';

export const GET = withRoute(async (request: NextRequest) => {
  const userId = await requireUserId(request);

  return NextResponse.json(await getProfile(userId));
});
