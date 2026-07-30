import { badRequest } from '@/src/server/http/errors';
import type { SelectedOptions } from '@/src/shared/contracts';

export type PricedOptionValue = {
  id: string;
  price: number | null;
};

export type PricedOption = {
  id: string;
  title: string;
  type: 'single' | 'multiple';
  required: boolean;
  values: PricedOptionValue[];
};

export type PricedProduct = {
  price: number;
  options: PricedOption[];
};

/**
 * Unit price of one cart line: the product's base price plus the surcharge of
 * every selected option value.
 *
 * This exists because the previous API trusted a `price` field sent by the
 * browser, checked only that it was a number, and summed those numbers into the
 * order total — anything could be bought for one rouble.
 *
 * Selections are validated on the way through: unknown option or value ids, a
 * second value for a `single` option, and a missing `required` option are all
 * rejected rather than silently priced as zero.
 */
export const computeItemPrice = (
  product: PricedProduct,
  selected: SelectedOptions,
): number => {
  const optionsById = new Map(product.options.map(o => [o.id, o]));

  let total = product.price;

  for (const [optionId, valueIds] of Object.entries(selected)) {
    if (valueIds.length === 0) continue;

    const option = optionsById.get(optionId);
    if (!option) {
      throw badRequest(`Unknown option: ${optionId}`, 'UNKNOWN_OPTION');
    }

    if (option.type === 'single' && valueIds.length > 1) {
      throw badRequest(
        `Option "${option.title}" accepts a single value`,
        'MULTIPLE_VALUES_FOR_SINGLE_OPTION',
      );
    }

    const valuesById = new Map(option.values.map(v => [v.id, v]));

    for (const valueId of valueIds) {
      const value = valuesById.get(valueId);
      if (!value) {
        throw badRequest(
          `Unknown value "${valueId}" for option "${option.title}"`,
          'UNKNOWN_OPTION_VALUE',
        );
      }

      total += value.price ?? 0;
    }
  }

  for (const option of product.options) {
    if (!option.required) continue;

    if (!selected[option.id]?.length) {
      throw badRequest(
        `Option "${option.title}" is required`,
        'MISSING_REQUIRED_OPTION',
      );
    }
  }

  return total;
};
