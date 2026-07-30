import { describe, expect, it } from 'vitest';

import { planCartMerge, type MergeableItem } from './merge-cart-items';

const item = (over: Partial<MergeableItem> = {}): MergeableItem => ({
  id: 'guest-item',
  productId: 'pizza-1',
  selectedOptions: '{"size":["size:30"]}',
  quantity: 1,
  price: 579,
  ...over,
});

describe('planCartMerge', () => {
  it('copies everything when the user has no cart lines', () => {
    const plan = planCartMerge([item(), item({ id: 'g2', productId: 'pizza-2' })], []);

    expect(plan.increments).toEqual([]);
    expect(plan.copies).toHaveLength(2);
    expect(plan.copies[0]).not.toHaveProperty('id');
  });

  it('sums quantities for a line matching on product and options', () => {
    const plan = planCartMerge(
      [item({ quantity: 2 })],
      [item({ id: 'user-item', quantity: 3 })],
    );

    expect(plan.copies).toEqual([]);
    expect(plan.increments).toEqual([{ id: 'user-item', quantity: 5 }]);
  });

  it('treats a different option selection as a separate line', () => {
    const plan = planCartMerge(
      [item({ selectedOptions: '{"size":["size:35"]}' })],
      [item({ id: 'user-item' })],
    );

    expect(plan.increments).toEqual([]);
    expect(plan.copies).toHaveLength(1);
  });

  it('treats a different product as a separate line', () => {
    const plan = planCartMerge(
      [item({ productId: 'sushi-1' })],
      [item({ id: 'user-item' })],
    );

    expect(plan.copies).toHaveLength(1);
  });

  it('does nothing for an empty guest cart', () => {
    expect(planCartMerge([], [item({ id: 'user-item' })])).toEqual({
      increments: [],
      copies: [],
    });
  });
});
