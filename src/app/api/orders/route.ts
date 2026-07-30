import { NextResponse, type NextRequest } from 'next/server';

import { readActor } from '@/src/server/auth/session';
import { readJson, withRoute } from '@/src/server/http/route';
import { createOrder } from '@/src/server/services/order.service';
import { createOrderSchema } from '@/src/shared/contracts';

export const POST = withRoute(async (request: NextRequest) => {
  const actor = await readActor(request);
  const input = createOrderSchema.parse(await readJson(request));

  const order = await createOrder(actor, input);

  return NextResponse.json(order);
});
