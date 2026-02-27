import { Request, Response } from 'express'

const FILTERS_MAP: Record<string, Record<string, string[]>> = {
  pizza: {
    meat: [
      'Курица',
      'Мясо',
      'Колбаски',
      'Острая колбаса',
      'Пепперони',
    ],

    cheese: [
      'Сыр',
      'Маздам',
      'Маскарпоне',
      'Советский',
      'Белорусский',
    ],

    sauce: [
      'Томатный соус',
      'Соус',
      'Соус BBQ',
    ],

    vegetables: [
      'Лук',
      'Томаты черри',
      'Шампиньоны',
      'Ананас',
    ],
  },

  sushi: {
    base: ['Рис'],

    fish: [
      'Рыба/морепродукты',
      'Краб/морепродукты',
      'Угорь',
      'Креветка',
    ],

    cheese: ['Сливочный сыр'],

    extras: [
      'Авокадо',
      'Овощи',
    ],
  },

  snacks: {
    meat: ['Курица'],

    vegetables: [
      'Лук',
      'Овощи',
    ],

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
    base: [
      'Сыр',
      'Апельсин',
      'Крем',
      'Молоко',
      'Вишня',
      'Клубника',
    ],
  },

  sauce: {
    base: [
      'Сыр',
      'Чеснок',
      'Томатная основа',
      'Соус',
      'Перец',
    ],
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
}

export const getFiltersByCategory = (req: Request, res: Response) => {
  const { categoryId } = req.params
  const filters = FILTERS_MAP[categoryId]

  if (!filters) {
    return res.status(404).json({ error: 'Category not found' })
  }

  res.json(filters)
}