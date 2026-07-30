import { NextResponse } from 'next/server';

import { readActor } from '@/src/server/auth/session';
import { withRoute } from '@/src/server/http/route';
import { getOrderById } from '@/src/server/services/order.service';

export const GET = withRoute<{ orderId: string }>(
  async (request, { params }) => {
    const { orderId } = await params;
    const actor = await readActor(request);

    // Ownership is part of the lookup: a caller with no session at all gets a
    // 404, where the old handler dropped the filter entirely and handed over
    // any order by id.
    return NextResponse.json(await getOrderById(actor, orderId));
  },
);
