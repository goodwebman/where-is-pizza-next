import { NextResponse } from 'next/server';

import { readActor } from '@/src/server/auth/session';
import { readJson, withRoute } from '@/src/server/http/route';
import { removeItem, updateItemQuantity } from '@/src/server/services/cart.service';
import { updateCartItemSchema } from '@/src/shared/contracts';

type Params = { itemId: string };

export const PATCH = withRoute<Params>(async (request, { params }) => {
  const { itemId } = await params;
  const { quantity } = updateCartItemSchema.parse(await readJson(request));
  const actor = await readActor(request);

  // Ownership is enforced inside the service: the previous implementation
  // updated by item id alone, so any caller could change any cart's contents.
  const cart = await updateItemQuantity(actor, itemId, quantity);

  return NextResponse.json(cart);
});

export const DELETE = withRoute<Params>(async (request, { params }) => {
  const { itemId } = await params;
  const actor = await readActor(request);

  const cart = await removeItem(actor, itemId);

  return NextResponse.json(cart);
});
