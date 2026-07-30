import { describe, expect, it } from 'vitest';

import { addToCartSchema, updateCartItemSchema } from './cart.contract';

describe('addToCartSchema', () => {
  it('defaults quantity and options', () => {
    expect(addToCartSchema.parse({ productId: 'pizza-1' })).toEqual({
      productId: 'pizza-1',
      quantity: 1,
      selectedOptions: {},
    });
  });

  it('strips a client-supplied price', () => {
    // The old endpoint took the price from the request body; there is now no
    // field to put it in, so a forged price cannot even be expressed.
    const parsed = addToCartSchema.parse({ productId: 'pizza-1', price: 1 });

    expect(parsed).not.toHaveProperty('price');
  });

  it('rejects a missing product', () => {
    expect(addToCartSchema.safeParse({}).success).toBe(false);
    expect(addToCartSchema.safeParse({ productId: '' }).success).toBe(false);
  });

  it('rejects a nonsensical quantity', () => {
    const bad = [0, -1, 1.5, 100];

    for (const quantity of bad) {
      expect(
        addToCartSchema.safeParse({ productId: 'pizza-1', quantity }).success,
      ).toBe(false);
    }
  });

  it('accepts a selection of options', () => {
    const parsed = addToCartSchema.parse({
      productId: 'pizza-1',
      selectedOptions: { 'pizza-1:size': ['pizza-1:size:30'] },
    });

    expect(parsed.selectedOptions).toEqual({
      'pizza-1:size': ['pizza-1:size:30'],
    });
  });

  it('rejects malformed option shapes', () => {
    expect(
      addToCartSchema.safeParse({
        productId: 'pizza-1',
        selectedOptions: { size: 'not-an-array' },
      }).success,
    ).toBe(false);
  });
});

describe('updateCartItemSchema', () => {
  it('requires an explicit quantity', () => {
    expect(updateCartItemSchema.safeParse({}).success).toBe(false);
  });

  it('rejects zero and negative quantities', () => {
    expect(updateCartItemSchema.safeParse({ quantity: 0 }).success).toBe(false);
    expect(updateCartItemSchema.safeParse({ quantity: -3 }).success).toBe(false);
  });

  it('accepts a sane quantity', () => {
    expect(updateCartItemSchema.parse({ quantity: 3 })).toEqual({ quantity: 3 });
  });
});
