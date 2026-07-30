import { describe, expect, it } from 'vitest';

import { toAddress } from './map-order';

const empty = {
  street: null,
  house: null,
  entrance: null,
  floor: null,
  apartment: null,
  intercom: null,
};

describe('toAddress', () => {
  it('nests the flat columns', () => {
    expect(
      toAddress({ ...empty, street: 'Ленина', house: '12', floor: '3' }),
    ).toEqual({ street: 'Ленина', house: '12', floor: '3' });
  });

  it('returns null when no field is filled in', () => {
    // A pickup order has no address; six undefined fields is not the same as that.
    expect(toAddress(empty)).toBeNull();
  });

  it('ignores empty strings', () => {
    expect(toAddress({ ...empty, street: '' })).toBeNull();
  });
});
