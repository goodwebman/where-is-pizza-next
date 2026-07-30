import { CATEGORIES, type CategoryId } from '../categories/categories';

export type FiltersMap = Record<string, string[]>;

/**
 * Filter groups per category. Values are matched against `Product.ingredients[].label`
 * by exact equality, so they must stay byte-identical to the labels in prisma/seed.ts.
 *
 * Semantics applied by `filterProducts`: AND between groups, OR within a group,
 * empty group ignored.
 */
export const FILTERS_MAP: Record<CategoryId, FiltersMap> = {
  pizza: {
    meat: ['Курица', 'Мясо', 'Колбаски', 'Острая колбаса', 'Пепперони'],
    cheese: ['Сыр', 'Маздам', 'Маскарпоне', 'Советский', 'Белорусский'],
    sauce: ['Томатный соус', 'Соус', 'Соус BBQ'],
    vegetables: ['Лук', 'Томаты черри', 'Шампиньоны', 'Ананас'],
  },

  sushi: {
    base: ['Рис'],
    fish: ['Рыба/морепродукты', 'Краб/морепродукты', 'Угорь', 'Креветка'],
    cheese: ['Сливочный сыр'],
    extras: ['Авокадо', 'Овощи'],
  },

  snacks: {
    meat: ['Курица'],
    vegetables: ['Лук', 'Овощи'],
    sauce: ['Соус BBQ'],
  },

  drinks: {
    base: [
      'Апельсин',
      'Цитрус',
      'Напиток',
      'Молоко',
      'Растительный ингредиент',
    ],
  },

  dessert: {
    base: ['Сыр', 'Апельсин', 'Крем', 'Молоко', 'Вишня', 'Клубника'],
  },

  sauce: {
    base: ['Сыр', 'Чеснок', 'Томатная основа', 'Соус', 'Перец'],
  },

  combos: {
    base: [
      'Пицца',
      'Напиток',
      'Сет роллов',
      'Фри',
      'Наггетсы',
      'Мини пицца',
      'Соус',
    ],
  },
};

export const isCategoryId = (value: string): value is CategoryId =>
  (CATEGORIES as readonly string[]).includes(value);

export const getFiltersForCategory = (
  categoryId: CategoryId,
): FiltersMap | undefined => FILTERS_MAP[categoryId];
