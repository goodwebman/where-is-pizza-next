import { NextResponse, type NextRequest } from 'next/server';

import { setGuestCookie } from '@/src/server/auth/cookies';
import { readActor } from '@/src/server/auth/session';
import { readJson, withRoute } from '@/src/server/http/route';
import { addToCart, getCart } from '@/src/server/services/cart.service';
import { addToCartSchema } from '@/src/shared/contracts';

export const GET = withRoute(async (request: NextRequest) => {
  const actor = await readActor(request);
  const cart = await getCart(actor);

  // null, not 404: "you have no cart yet" is a normal state for a first visit.
  return NextResponse.json(cart);
});

export const POST = withRoute(async (request: NextRequest) => {
  const actor = await readActor(request);
  const input = addToCartSchema.parse(await readJson(request));

  const { item, issuedGuestId } = await addToCart(actor, input);

  const response = NextResponse.json(item);

  // Only when an anonymous visitor's cart was just created.
  if (issuedGuestId) setGuestCookie(response.cookies, issuedGuestId);

  return response;
});
