import { describe, expect, it } from 'vitest';

import { toReadableOptions, type LabelledOption } from './transform-options';

const options: LabelledOption[] = [
  {
    id: 'size',
    title: 'Размер',
    values: [
      { id: 'size:25', title: '25 см' },
      { id: 'size:30', title: '30 см' },
    ],
  },
  {
    id: 'extra',
    title: 'Дополнительно',
    values: [
      { id: 'extra:cheese', title: 'Доп сыр' },
      { id: 'extra:champignons', title: 'Шампиньоны' },
    ],
  },
];

describe('toReadableOptions', () => {
  it('maps ids onto titles', () => {
    expect(toReadableOptions({ size: ['size:30'] }, options)).toEqual({
      Размер: ['30 см'],
    });
  });

  it('keeps every selected value of a group', () => {
    expect(
      toReadableOptions(
        { extra: ['extra:cheese', 'extra:champignons'] },
        options,
      ),
    ).toEqual({ Дополнительно: ['Доп сыр', 'Шампиньоны'] });
  });

  it('skips groups with nothing selected', () => {
    expect(toReadableOptions({ size: [] }, options)).toEqual({});
  });

  it('skips ids that no longer exist rather than throwing', () => {
    // Stored carts and order snapshots must keep rendering after a catalogue edit.
    expect(toReadableOptions({ size: ['size:99'], gone: ['x'] }, options)).toEqual(
      {},
    );
  });

  it('returns an empty object for an empty selection', () => {
    expect(toReadableOptions({}, options)).toEqual({});
  });
});
