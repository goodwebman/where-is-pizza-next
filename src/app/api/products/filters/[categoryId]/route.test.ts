import { describe, expect, it } from 'vitest';

import type { FiltersMap } from '@/src/shared/config';
import { callRoute } from '@/src/test/integration/call-route';
import { GET } from './route';

const getFilters = (categoryId: string) =>
  callRoute<FiltersMap>(GET, {
    url: `/api/products/filters/${categoryId}`,
    params: { categoryId },
  });

describe('GET /api/products/filters/[categoryId]', () => {
  it('returns the groups for a category', async () => {
    const { status, json } = await getFilters('pizza');

    expect(status).toBe(200);
    expect(Object.keys(json)).toEqual([
      'meat',
      'cheese',
      'sauce',
      'vegetables',
    ]);
    expect(json.meat).toContain('Пепперони');
  });

  it('serves every category', async () => {
    const categories = [
      'pizza',
      'sushi',
      'dessert',
      'drinks',
      'sauce',
      'snacks',
      'combos',
    ];

    for (const categoryId of categories) {
      const { status, json } = await getFilters(categoryId);

      expect(status).toBe(200);
      expect(Object.keys(json).length).toBeGreaterThan(0);
    }
  });

  it('404s on an unknown category', async () => {
    const { status, json } = await getFilters('burgers');

    expect(status).toBe(404);
    expect(json).toEqual({
      error: 'Category not found',
      code: 'CATEGORY_NOT_FOUND',
    });
  });

  it('only offers labels that products actually carry', async () => {
    // Guards the coupling between FILTERS_MAP and the seed: a filter value that
    // matches no ingredient label would render a group that always returns zero
    // results.
    const { json } = await getFilters('sushi');

    expect(json.fish).toContain('Угорь');
    expect(json.base).toEqual(['Рис']);
  });
});
