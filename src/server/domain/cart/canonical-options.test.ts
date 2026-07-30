import { describe, expect, it } from 'vitest';

import { canonicalOptions, parseCanonicalOptions } from './canonical-options';

describe('canonicalOptions', () => {
  it('is independent of key order', () => {
    const a = canonicalOptions({ size: ['30'], dough: ['thin'] });
    const b = canonicalOptions({ dough: ['thin'], size: ['30'] });

    expect(a).toBe(b);
  });

  it('is independent of value order within a group', () => {
    const a = canonicalOptions({ extra: ['cheese', 'champignons'] });
    const b = canonicalOptions({ extra: ['champignons', 'cheese'] });

    expect(a).toBe(b);
  });

  it('drops empty selections so they cannot split a cart line', () => {
    expect(canonicalOptions({ size: ['30'], extra: [] })).toBe(
      canonicalOptions({ size: ['30'] }),
    );
  });

  it('deduplicates repeated value ids', () => {
    expect(canonicalOptions({ extra: ['cheese', 'cheese'] })).toBe(
      canonicalOptions({ extra: ['cheese'] }),
    );
  });

  it('produces an empty object for no selection', () => {
    expect(canonicalOptions({})).toBe('{}');
  });

  it('round-trips through parseCanonicalOptions', () => {
    const selected = { size: ['30'], extra: ['cheese', 'champignons'] };

    expect(parseCanonicalOptions(canonicalOptions(selected))).toEqual({
      size: ['30'],
      extra: ['champignons', 'cheese'],
    });
  });

  it('parses malformed stored data as an empty selection', () => {
    expect(parseCanonicalOptions('not json')).toEqual({});
    expect(parseCanonicalOptions('[1,2]')).toEqual({});
    expect(parseCanonicalOptions('null')).toEqual({});
  });
});
