import 'server-only';

import { prisma, type Db } from '@/src/server/db/prisma';
import { filterProducts } from '@/src/server/domain/product/filter-products';
import { toProductDto } from '@/src/server/dto/product.dto';
import type { ProductDetails } from '@/src/entities/product/model/types';
import { CATEGORIES, type CategoryId } from '@/src/shared/config';
import type { GetProductsInput } from '@/src/shared/contracts';

const productInclude = {
  nutrition: true,
  options: {
    orderBy: { id: 'asc' },
    include: { values: { orderBy: { id: 'asc' } } },
  },
} as const;

/**
 * Deterministic ordering. Without it Postgres is free to return rows in any
 * order, which makes the ISR-rendered home page differ from a client refetch
 * for no reason.
 */
const productOrderBy = [{ categoryId: 'asc' }, { id: 'asc' }] as const;

export const getProducts = async (
  input: GetProductsInput,
  db: Db = prisma,
): Promise<ProductDetails[]> => {
  const rows = await db.product.findMany({
    where: input.categoryId ? { categoryId: input.categoryId } : undefined,
    include: productInclude,
    orderBy: [...productOrderBy],
  });

  const products = rows.map(toProductDto);

  return filterProducts(products, input.filters);
};

/**
 * One query for the whole catalogue, grouped for the home page.
 *
 * The page previously issued 14 prefetches (7 categories × products + filters)
 * over HTTP to a separate service. Filters are a static constant, and every
 * product fits in a single findMany.
 */
export const getAllProductsGrouped = async (
  db: Db = prisma,
): Promise<Record<CategoryId, ProductDetails[]>> => {
  const rows = await db.product.findMany({
    include: productInclude,
    orderBy: [...productOrderBy],
  });

  const grouped = Object.fromEntries(
    CATEGORIES.map(categoryId => [categoryId, [] as ProductDetails[]]),
  ) as Record<CategoryId, ProductDetails[]>;

  for (const row of rows) {
    const product = toProductDto(row);
    grouped[product.categoryId]?.push(product);
  }

  return grouped;
};

export type PricedProductRow = {
  id: string;
  title: string;
  imageSrc: string;
  price: number;
  ingredients: unknown;
  options: {
    id: string;
    title: string;
    type: string;
    required: boolean;
    values: { id: string; title: string; price: number | null }[];
  }[];
};

/** Catalogue data needed to price and snapshot a cart line. */
export const findProductForPricing = async (
  productId: string,
  db: Db = prisma,
) =>
  db.product.findUnique({
    where: { id: productId },
    include: {
      options: { include: { values: true } },
    },
  });
