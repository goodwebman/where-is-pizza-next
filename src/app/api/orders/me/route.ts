import { NextResponse, type NextRequest } from 'next/server';

import { readActor } from '@/src/server/auth/session';
import { withRoute } from '@/src/server/http/route';
import { getMyOrders } from '@/src/server/services/order.service';
import { getOrdersQuerySchema } from '@/src/shared/contracts';

export const GET = withRoute(async (request: NextRequest) => {
  const actor = await readActor(request);

  const query = getOrdersQuerySchema.parse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  return NextResponse.json(await getMyOrders(actor, query));
});
