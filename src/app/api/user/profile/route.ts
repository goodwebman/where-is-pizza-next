import { NextResponse, type NextRequest } from 'next/server';

import { requireUserId } from '@/src/server/auth/session';
import { readJson, withRoute } from '@/src/server/http/route';
import { updateProfile } from '@/src/server/services/user.service';
import { updateProfileSchema } from '@/src/shared/contracts';

export const PATCH = withRoute(async (request: NextRequest) => {
  const userId = await requireUserId(request);
  const input = updateProfileSchema.parse(await readJson(request));

  return NextResponse.json(await updateProfile(userId, input));
});
