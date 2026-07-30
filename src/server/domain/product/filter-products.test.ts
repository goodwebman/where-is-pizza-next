import { describe, expect, it } from 'vitest';

import { filterProducts } from './filter-products';

const products = [
  {
    id: 'pizza-1',
    ingredients: [
      { id: 'pepperoni', label: 'Пепперони' },
      { id: 'cheese', label: 'Сыр' },
    ],
  },
  {
    id: 'pizza-2',
    ingredients: [
      { id: 'chicken', label: 'Курица' },
      { id: 'cheese', label: 'Сыр' },
    ],
  },
  {
    id: 'pizza-3',
    ingredients: [{ id: 'champignons', label: 'Шампиньоны' }],
  },
];

const ids = (result: { id: string }[]) => result.map(p => p.id);

describe('filterProducts', () => {
  it('returns everything when no filters are given', () => {
    expect(ids(filterProducts(products, undefined))).toEqual([
      'pizza-1',
      'pizza-2',
      'pizza-3',
    ]);
    expect(ids(filterProducts(products, {}))).toHaveLength(3);
  });

  it('ORs values within a group', () => {
    const result = filterProducts(products, {
      meat: ['Пепперони', 'Курица'],
    });

    expect(ids(result)).toEqual(['pizza-1', 'pizza-2']);
  });

  it('ANDs across groups', () => {
    const result = filterProducts(products, {
      meat: ['Курица'],
      cheese: ['Сыр'],
    });

    expect(ids(result)).toEqual(['pizza-2']);
  });

  it('ignores empty groups instead of excluding everything', () => {
    const result = filterProducts(products, {
      meat: ['Курица'],
      vegetables: [],
    });

    expect(ids(result)).toEqual(['pizza-2']);
  });

  it('matches labels exactly', () => {
    expect(filterProducts(products, { meat: ['курица'] })).toEqual([]);
    expect(filterProducts(products, { meat: ['Кур'] })).toEqual([]);
  });

  it('returns a copy, never the input array', () => {
    const result = filterProducts(products, undefined);
    expect(result).not.toBe(products);
  });
});
