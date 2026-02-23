export const CATEGORIES = [
  'pizza',
  'sushi',
  'dessert',
  'drinks',
  'sauce',
  'snacks',
  'combos',
] as const;

export const CATEGORY_NAMES = CATEGORIES.reduce((acc, c) => {
  acc[c] = c;
  return acc;
}, {} as Record<CategoryId, CategoryId>);
export type CategoryId = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<CategoryId, string> = {
  pizza: 'Пицца',
  sushi: 'Суши',
  dessert: 'Десерты',
  sauce: 'Соусы',
  combos: 'Комбо',
  drinks: 'Напитки',
  snacks: 'Снэки',
};

export const getCategoryLabel = (categoryId: CategoryId): string =>
  CATEGORY_LABELS[categoryId] ?? categoryId;

export const CATEGORIES_NAV_ITEMS = CATEGORIES.map(category => ({
  anchor: category,
  label: CATEGORY_LABELS[category],
}));
