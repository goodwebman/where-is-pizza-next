import type { SelectedOptions } from '@/src/shared/contracts';

/**
 * Serialises selected options to a canonical JSON string: option keys sorted,
 * value ids sorted within each key, empty selections dropped.
 *
 * Cart de-duplication compares this string byte-for-byte (it backs a unique
 * index). Without canonicalisation, clicking "cheese then mushrooms" and
 * "mushrooms then cheese" produced two separate cart lines for the same pizza.
 */
export const canonicalOptions = (selected: SelectedOptions): string => {
  const normalised: Record<string, string[]> = {};

  for (const key of Object.keys(selected).sort()) {
    const values = selected[key];
    if (!values || values.length === 0) continue;

    // Deduplicate as well: the same value id twice is the same selection.
    normalised[key] = [...new Set(values)].sort();
  }

  return JSON.stringify(normalised);
};

/** Inverse of {@link canonicalOptions}; tolerates malformed stored data. */
export const parseCanonicalOptions = (raw: string): SelectedOptions => {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed as SelectedOptions;
  } catch {
    return {};
  }
};
