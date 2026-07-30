import 'server-only';

import { randomUUID } from 'node:crypto';

import type { Cart, CartItem } from '@/src/entities/cart/model/types';
import { prisma, type Db } from '@/src/server/db/prisma';
import {
  canonicalOptions,
  parseCanonicalOptions,
} from '@/src/server/domain/cart/canonical-options';
import { computeItemPrice } from '@/src/server/domain/cart/compute-item-price';
import { planCartMerge } from '@/src/server/domain/cart/merge-cart-items';
import { toReadableOptions } from '@/src/server/domain/cart/transform-options';
import { toProductDto } from '@/src/server/dto/product.dto';
import { notFound } from '@/src/server/http/errors';
import type { RequestActor } from '@/src/server/auth/session';
import type { AddToCartInput } from '@/src/shared/contracts';

const cartInclude = {
  items: {
    orderBy: { createdAt: 'asc' },
    include: {
      product: {
        include: {
          nutrition: true,
          options: {
            orderBy: { id: 'asc' },
            include: { values: { orderBy: { id: 'asc' } } },
          },
        },
      },
    },
  },
} as const;

/**
 * A logged-in user's cart always wins over a guest cookie.
 *
 * The old code never populated the user side at all — `req.user` was never
 * assigned anywhere — so every cart operation, for everyone, went through the
 * guest cookie and carts were never attached to accounts.
 */
const findCart = (actor: RequestActor, db: Db) => {
  if (actor.userId) {
    return db.cart.findUnique({
      where: { userId: actor.userId },
      include: cartInclude,
    });
  }

  if (actor.guestId) {
    return db.cart.findUnique({
      where: { guestId: actor.guestId },
      include: cartInclude,
    });
  }

  return null;
};

type ResolvedCart = { id: string; guestId: string | null };

/** Finds the actor's cart, creating one if this is their first item. */
const resolveCartForWrite = async (
  actor: RequestActor,
  db: Db,
): Promise<ResolvedCart> => {
  if (actor.userId) {
    const existing = await db.cart.findUnique({
      where: { userId: actor.userId },
    });
    if (existing) return existing;

    return db.cart.create({ data: { userId: actor.userId } });
  }

  if (actor.guestId) {
    const existing = await db.cart.findUnique({
      where: { guestId: actor.guestId },
    });
    if (existing) return existing;
  }

  // The client may propose a guest id via its cookie; if it did not, mint one.
  return db.cart.create({ data: { guestId: actor.guestId ?? randomUUID() } });
};

type CartRow = NonNullable<Awaited<ReturnType<typeof findCart>>>;

const toCartDto = (cart: CartRow): Cart => ({
  id: cart.id,
  userId: cart.userId ?? undefined,
  createdAt: cart.createdAt.toISOString(),
  updatedAt: cart.updatedAt.toISOString(),
  items: cart.items.map(item => ({
    id: item.id,
    quantity: item.quantity,
    price: item.price,
    // Stored as ids; the UI wants titles.
    selectedOptions: toReadableOptions(
      parseCanonicalOptions(item.selectedOptions),
      item.product.options,
    ),
    product: toProductDto(item.product),
  })),
});

export const getCart = async (
  actor: RequestActor,
  db: Db = prisma,
): Promise<Cart | null> => {
  const cart = await findCart(actor, db);
  return cart ? toCartDto(cart) : null;
};

export type AddToCartResult = {
  item: CartItem;
  /** Set when a guest cart was just created and the cookie has to be issued. */
  issuedGuestId?: string;
};

export const addToCart = async (
  actor: RequestActor,
  input: AddToCartInput,
  db: Db = prisma,
): Promise<AddToCartResult> => {
  const product = await db.product.findUnique({
    where: { id: input.productId },
    include: {
      nutrition: true,
      options: {
        orderBy: { id: 'asc' },
        include: { values: { orderBy: { id: 'asc' } } },
      },
    },
  });

  if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');

  // Price comes from the catalogue, never from the request.
  const price = computeItemPrice(product, input.selectedOptions);
  const options = canonicalOptions(input.selectedOptions);

  const cart = await resolveCartForWrite(actor, db);

  // Atomic thanks to the unique index on (cartId, productId, selectedOptions):
  // two concurrent adds cannot produce duplicate lines.
  const item = await db.cartItem.upsert({
    where: {
      cartId_productId_selectedOptions: {
        cartId: cart.id,
        productId: input.productId,
        selectedOptions: options,
      },
    },
    create: {
      cartId: cart.id,
      productId: input.productId,
      quantity: input.quantity,
      selectedOptions: options,
      price,
    },
    update: {
      quantity: { increment: input.quantity },
      // Re-price on every add so a stale line cannot keep an outdated price.
      price,
    },
  });

  return {
    item: {
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      selectedOptions: toReadableOptions(
        parseCanonicalOptions(item.selectedOptions),
        product.options,
      ),
      product: toProductDto(product),
    },
    issuedGuestId:
      !actor.userId && cart.guestId && cart.guestId !== actor.guestId
        ? cart.guestId
        : undefined,
  };
};

/**
 * Ownership is part of the WHERE clause, not a separate check.
 *
 * The previous version located the cart, then updated the item by id alone —
 * so any authenticated or anonymous caller could change the quantity of any
 * cart line in the database given its id.
 */
const requireOwnedItem = async (
  actor: RequestActor,
  itemId: string,
  db: Db,
): Promise<{ id: string; cartId: string }> => {
  const cart = await findCart(actor, db);
  if (!cart) throw notFound('Cart not found', 'CART_NOT_FOUND');

  const item = cart.items.find(candidate => candidate.id === itemId);
  // 404 rather than 403: confirming that someone else's item id exists is itself
  // a leak.
  if (!item) throw notFound('Cart item not found', 'CART_ITEM_NOT_FOUND');

  return { id: item.id, cartId: cart.id };
};

export const updateItemQuantity = async (
  actor: RequestActor,
  itemId: string,
  quantity: number,
  db: Db = prisma,
): Promise<Cart> => {
  const item = await requireOwnedItem(actor, itemId, db);

  await db.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });

  const cart = await findCart(actor, db);
  if (!cart) throw notFound('Cart not found', 'CART_NOT_FOUND');

  return toCartDto(cart);
};

export const removeItem = async (
  actor: RequestActor,
  itemId: string,
  db: Db = prisma,
): Promise<Cart> => {
  const item = await requireOwnedItem(actor, itemId, db);

  await db.cartItem.delete({ where: { id: item.id } });

  const cart = await findCart(actor, db);
  if (!cart) throw notFound('Cart not found', 'CART_NOT_FOUND');

  return toCartDto(cart);
};

export const clearCart = async (
  actor: RequestActor,
  db: Db = prisma,
): Promise<void> => {
  const cart = await findCart(actor, db);
  if (!cart) throw notFound('Cart not found', 'CART_NOT_FOUND');

  // Keyed on Cart.id. The old endpoint passed the guest cookie value here, which
  // matches no CartItem.cartId, so clearing a cart silently did nothing.
  await db.cartItem.deleteMany({ where: { cartId: cart.id } });
};

export const emptyCart = async (cartId: string, db: Db = prisma) => {
  await db.cartItem.deleteMany({ where: { cartId } });
};

/**
 * Folds a guest cart into a user's cart. Runs inside the caller's transaction —
 * a half-merged cart would silently lose items.
 */
export const mergeGuestCart = async (
  guestId: string,
  userId: number,
  db: Db,
): Promise<void> => {
  const guestCart = await db.cart.findUnique({
    where: { guestId },
    include: { items: true },
  });

  if (!guestCart) return;

  const userCart = await db.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    // Nothing to merge into: hand the whole cart over.
    await db.cart.update({
      where: { id: guestCart.id },
      data: { userId, guestId: null },
    });
    return;
  }

  const plan = planCartMerge(guestCart.items, userCart.items);

  for (const increment of plan.increments) {
    await db.cartItem.update({
      where: { id: increment.id },
      data: { quantity: increment.quantity },
    });
  }

  if (plan.copies.length > 0) {
    await db.cartItem.createMany({
      data: plan.copies.map(copy => ({ ...copy, cartId: userCart.id })),
    });
  }

  await db.cart.delete({ where: { id: guestCart.id } });
};

export const cartItemCount = async (cartId: string, db: Db = prisma) =>
  db.cartItem.count({ where: { cartId } });

export const findCartForCheckout = (actor: RequestActor, db: Db = prisma) =>
  findCart(actor, db);

export { toCartDto };
