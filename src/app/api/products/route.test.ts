import { describe, expect, it } from 'vitest';

import type { ProductDetails } from '@/src/entities/product/model/types';
import { callRoute } from '@/src/test/integration/call-route';
import { POST } from './route';

const getProducts = (body: unknown) =>
  callRoute<ProductDetails[]>(POST, {
    url: '/api/products',
    method: 'POST',
    body,
  });

describe('POST /api/products', () => {
  it('returns the whole catalogue for an empty request', async () => {
    const { status, json } = await getProducts({});

    expect(status).toBe(200);
    expect(json).toHaveLength(37);
  });

  it('narrows to a category', async () => {
    const { json } = await getProducts({ categoryId: 'pizza' });

    expect(json).toHaveLength(8);
    expect(json.every(p => p.categoryId === 'pizza')).toBe(true);
  });

  it('serves images from a relative path', async () => {
    const { json } = await getProducts({ categoryId: 'pizza' });

    // The old seed baked http://localhost:4000 into every row.
    expect(json[0].imageSrc).toMatch(/^\/images\//);
  });

  it('includes options with their surcharges', async () => {
    const { json } = await getProducts({ categoryId: 'pizza' });
    const size = json[0].options?.find(option => option.title === 'Размер');

    expect(size).toBeDefined();
    expect(size?.required).toBe(true);
    expect(size?.values.find(v => v.title === '30 см')?.price).toBe(80);
  });

  it('returns ingredients as an array, not a JSON string', async () => {
    const { json } = await getProducts({ categoryId: 'dessert' });

    expect(Array.isArray(json[0].ingredients)).toBe(true);
    expect(json[0].ingredients[0]).toHaveProperty('label');
  });

  it('filters with OR inside a group', async () => {
    const { json } = await getProducts({
      categoryId: 'pizza',
      filters: { meat: ['Курица', 'Пепперони'] },
    });

    expect(json.length).toBeGreaterThan(0);
    expect(
      json.every(p =>
        p.ingredients.some(i => ['Курица', 'Пепперони'].includes(i.label)),
      ),
    ).toBe(true);
  });

  it('filters with AND across groups', async () => {
    const both = await getProducts({
      categoryId: 'pizza',
      filters: { meat: ['Курица'], vegetables: ['Ананас'] },
    });

    const meatOnly = await getProducts({
      categoryId: 'pizza',
      filters: { meat: ['Курица'] },
    });

    expect(both.json.length).toBeLessThanOrEqual(meatOnly.json.length);
    expect(both.json.every(p => p.title === 'Гавайская')).toBe(true);
  });

  it('ignores empty filter groups', async () => {
    const { json } = await getProducts({
      categoryId: 'pizza',
      filters: { meat: [], cheese: [] },
    });

    expect(json).toHaveLength(8);
  });

  it('rejects an unknown category', async () => {
    const { status, json } = await getProducts({ categoryId: 'burgers' });

    expect(status).toBe(400);
    expect(json).toHaveProperty('error');
  });

  it('rejects a malformed body', async () => {
    const { status } = await getProducts({ filters: 'not-an-object' });

    expect(status).toBe(400);
  });

  it('returns a string error message, not an object', async () => {
    // getErrorMessage on the client reads data.error straight into a toast.
    const { json } = await getProducts({ categoryId: 'burgers' });

    expect(typeof (json as unknown as { error: unknown }).error).toBe('string');
  });

  it('is ordered deterministically', async () => {
    const first = await getProducts({ categoryId: 'pizza' });
    const second = await getProducts({ categoryId: 'pizza' });

    expect(first.json.map(p => p.id)).toEqual(second.json.map(p => p.id));
  });
});
