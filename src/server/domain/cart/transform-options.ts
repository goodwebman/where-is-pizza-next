import type { SelectedOptions } from '@/src/shared/contracts';

export type LabelledOptionValue = { id: string; title: string };

export type LabelledOption = {
  id: string;
  title: string;
  values: LabelledOptionValue[];
};

/**
 * Turns stored `Record<optionId, valueId[]>` into the human-readable
 * `Record<optionTitle, valueTitle[]>` the UI renders.
 *
 * Unknown ids are skipped rather than thrown on: stored carts and order
 * snapshots must keep rendering even if a product's options were edited since.
 */
export const toReadableOptions = (
  selected: SelectedOptions,
  options: readonly LabelledOption[],
): Record<string, string[]> => {
  const readable: Record<string, string[]> = {};

  for (const option of options) {
    const selectedIds = selected[option.id];
    if (!selectedIds?.length) continue;

    const titles = option.values
      .filter(value => selectedIds.includes(value.id))
      .map(value => value.title);

    if (titles.length > 0) {
      readable[option.title] = titles;
    }
  }

  return readable;
};
