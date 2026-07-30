import { NextResponse, type NextRequest } from 'next/server';

import { readActor } from '@/src/server/auth/session';
import { withRoute } from '@/src/server/http/route';
import { clearCart } from '@/src/server/services/cart.service';

/**
 * Under Express this route was unreachable — `DELETE /cart/:itemId` was declared
 * first and matched "clear" as an item id. Next's file routing prefers the
 * static segment, so it works here; the underlying service bug (clearing by the
 * guest cookie instead of the cart id) is fixed too.
 */
export const DELETE = withRoute(async (request: NextRequest) => {
  const actor = await readActor(request);
  await clearCart(actor);

  return NextResponse.json({ success: true });
});
