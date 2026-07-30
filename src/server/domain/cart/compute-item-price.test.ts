import { describe, expect, it } from 'vitest';

import { AppError } from '@/src/server/http/errors';
import { computeItemPrice, type PricedProduct } from './compute-item-price';

const pizza: PricedProduct = {
  price: 499,
  options: [
    {
      id: 'size',
      title: 'Размер',
      type: 'single',
      required: true,
      values: [
        { id: 'size:25', price: null },
        { id: 'size:30', price: 80 },
        { id: 'size:35', price: 140 },
      ],
    },
    {
      id: 'extra',
      title: 'Дополнительно',
      type: 'multiple',
      required: false,
      values: [
        { id: 'extra:cheese', price: 59 },
        { id: 'extra:champignons', price: 69 },
      ],
    },
  ],
};

const dessert: PricedProduct = { price: 290, options: [] };

describe('computeItemPrice', () => {
  it('returns the base price when a product has no options', () => {
    expect(computeItemPrice(dessert, {})).toBe(290);
  });

  it('adds the surcharge of a single-choice option', () => {
    expect(computeItemPrice(pizza, { size: ['size:30'] })).toBe(579);
  });

  it('treats a null surcharge as zero', () => {
    expect(computeItemPrice(pizza, { size: ['size:25'] })).toBe(499);
  });

  it('sums every value of a multiple-choice option', () => {
    const price = computeItemPrice(pizza, {
      size: ['size:35'],
      extra: ['extra:cheese', 'extra:champignons'],
    });

    expect(price).toBe(499 + 140 + 59 + 69);
  });

  it('rejects an unknown option id', () => {
    expect(() => computeItemPrice(pizza, { size: ['size:30'], nope: ['x'] }))
      .toThrowError(AppError);
  });

  it('rejects an unknown value id', () => {
    expect(() => computeItemPrice(pizza, { size: ['size:99'] })).toThrowError(
      /Unknown value/,
    );
  });

  it('rejects two values for a single-choice option', () => {
    expect(() =>
      computeItemPrice(pizza, { size: ['size:25', 'size:30'] }),
    ).toThrowError(/single value/);
  });

  it('rejects a missing required option', () => {
    expect(() => computeItemPrice(pizza, {})).toThrowError(/is required/);
    expect(() => computeItemPrice(pizza, { size: [] })).toThrowError(
      /is required/,
    );
  });

  it('reports a 400, not a 500, for every rejection', () => {
    try {
      computeItemPrice(pizza, { size: ['size:99'] });
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).status).toBe(400);
    }
  });

  it('ignores any price the caller thinks the item costs', () => {
    // Regression guard for the old endpoint, which took `price` from the request
    // body and only checked it was a number.
    const forged = { ...pizza, price: 1 } as PricedProduct & { price: number };

    expect(computeItemPrice(pizza, { size: ['size:30'] })).toBe(579);
    expect(computeItemPrice(forged, { size: ['size:30'] })).toBe(81);
  });
});
