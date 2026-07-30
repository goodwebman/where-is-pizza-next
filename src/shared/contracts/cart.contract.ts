import { z } from 'zod';

export const MAX_ITEM_QUANTITY = 99;

/**
 * Record<optionId, valueId[]>. Ids are opaque to the client — it echoes back
 * what `GET /api/products` returned.
 */
export const selectedOptionsSchema = z.record(
  z.string().min(1),
  z.array(z.string().min(1)),
);

/**
 * Note what is absent: `price`. The old endpoint accepted a client-supplied
 * price and only checked `typeof === 'number'`, so anything could be ordered
 * for one rouble. Price is now derived server-side from the product and the
 * selected options; sending it is not just ignored but impossible to express.
 */
export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY).default(1),
  selectedOptions: selectedOptionsSchema.default({}),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type SelectedOptions = z.infer<typeof selectedOptionsSchema>;
