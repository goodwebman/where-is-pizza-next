import { randomUUID } from 'node:crypto';

import { hashPassword } from '@/src/server/auth/password';
import { signAccessToken } from '@/src/server/auth/tokens';
import { prisma } from '@/src/server/db/prisma';
import { canonicalOptions } from '@/src/server/domain/cart/canonical-options';
import type { SelectedOptions } from '@/src/shared/contracts';

export const PIZZA_ID = 'pizza-1';
export const PIZZA_BASE_PRICE = 499;
export const PIZZA_SIZE_OPTION = 'pizza-1:size';
export const PIZZA_SIZE_30 = 'pizza-1:size:30';
export const PIZZA_SIZE_30_SURCHARGE = 80;
export const PIZZA_EXTRA_OPTION = 'pizza-1:extra';
export const PIZZA_EXTRA_CHEESE = 'pizza-1:extra:cheese';
export const PIZZA_EXTRA_CHEESE_SURCHARGE = 59;

/** A pizza requires a size, so most cart fixtures need at least this. */
export const validPizzaOptions: SelectedOptions = {
  [PIZZA_SIZE_OPTION]: [PIZZA_SIZE_30],
};

export const DESSERT_ID = 'dessert-1';
export const DESSERT_PRICE = 290;

export const testPassword = 'test-password';

type CreatedUser = {
  id: number;
  email: string;
  username: string;
  cookies: Record<string, string>;
};

/** A user plus the cookie jar an authenticated request would carry. */
export const createUser = async (
  overrides: { email?: string; username?: string; password?: string } = {},
): Promise<CreatedUser> => {
  const suffix = randomUUID().slice(0, 8);

  const user = await prisma.user.create({
    data: {
      email: overrides.email ?? `user-${suffix}@example.com`,
      username: overrides.username ?? `user-${suffix}`,
      password: await hashPassword(overrides.password ?? testPassword),
    },
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    cookies: { wp_at: await signAccessToken({ userId: user.id }) },
  };
};

export const createGuestCart = async (guestId = randomUUID()) => {
  const cart = await prisma.cart.create({ data: { guestId } });
  return { cart, guestId, cookies: { guestId } };
};

export const createUserCart = async (userId: number) =>
  prisma.cart.create({ data: { userId } });

export const addCartItem = async (
  cartId: string,
  {
    productId = PIZZA_ID,
    quantity = 1,
    price = PIZZA_BASE_PRICE + PIZZA_SIZE_30_SURCHARGE,
    selectedOptions = validPizzaOptions,
  }: {
    productId?: string;
    quantity?: number;
    price?: number;
    selectedOptions?: SelectedOptions;
  } = {},
) =>
  prisma.cartItem.create({
    data: {
      cartId,
      productId,
      quantity,
      price,
      selectedOptions: canonicalOptions(selectedOptions),
    },
  });
