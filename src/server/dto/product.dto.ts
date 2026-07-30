import type {
  Ingredients,
  ProductDetails,
} from '@/src/entities/product/model/types';
import type { CategoryId } from '@/src/shared/config';

/**
 * Structural input rather than a Prisma payload type: it keeps the mapper
 * testable without a database and documents exactly which columns are read.
 */
export type ProductRow = {
  id: string;
  categoryId: string;
  title: string;
  imageSrc: string;
  ingredients: unknown;
  price: number;
  badge: string | null;
  nutrition: { caloriesPer100g: number } | null;
  options: {
    id: string;
    title: string;
    type: string;
    required: boolean;
    values: {
      id: string;
      slug: string;
      title: string;
      price: number | null;
      weight: number | null;
    }[];
  }[];
};

const asIngredients = (value: unknown): Ingredients[] =>
  Array.isArray(value) ? (value as Ingredients[]) : [];

/**
 * Everything crossing this boundary must be JSON-primitive. The same DTO is
 * both returned by route handlers and pushed into the React Query cache from a
 * Server Component; if one path produced a Date and the other a string, the
 * cache would hold two shapes for the same key.
 */
export const toProductDto = (product: ProductRow): ProductDetails => ({
  id: product.id,
  categoryId: product.categoryId as CategoryId,
  title: product.title,
  imageSrc: product.imageSrc,
  ingredients: asIngredients(product.ingredients),
  price: product.price,
  badge: (product.badge as ProductDetails['badge']) ?? undefined,
  nutrition: product.nutrition
    ? { caloriesPer100g: product.nutrition.caloriesPer100g }
    : undefined,
  options: product.options.map(option => ({
    id: option.id,
    title: option.title,
    type: option.type as 'single' | 'multiple',
    required: option.required,
    values: option.values.map(value => ({
      id: value.id,
      slug: value.slug,
      title: value.title,
      price: value.price ?? undefined,
      weight: value.weight ?? undefined,
    })),
  })),
});
