import { CategoryId } from '@/src/shared/config';

export type ProductOptionValue = {
  id: string;
  slug: string;
  title: string;
  price?: number;
  weight?: number;
};

export type ProductOption = {
  id: string;
  title: string;
  type: 'single' | 'multiple';
  required?: boolean;
  values: ProductOptionValue[];
};

export type Ingredients = {
  id: string;
  label: string;
};

export type Product = {
  id: string;
  categoryId: CategoryId;
  title: string;
  imageSrc: string;
  ingredients: Ingredients[];
  price: number;
  badge?: 'new' | 'popular';
};

export type NutritionInfo = {
  caloriesPer100g: number;
  proteinsPer100g?: number;
  fatsPer100g?: number;
  carbsPer100g?: number;
};

export type ProductDetails = Product & {
  nutrition?: NutritionInfo;
  options?: ProductOption[];
};
