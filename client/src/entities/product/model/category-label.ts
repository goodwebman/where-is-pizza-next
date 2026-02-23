import { CategoryId } from '../../filters/model/types';

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
