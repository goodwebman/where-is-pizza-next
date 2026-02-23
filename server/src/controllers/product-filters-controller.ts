import { Request, Response } from 'express'

const FILTERS_MAP: Record<string, Record<string, string[]>> = {
	pizza: {
		base: ['Тонкое', 'Пышное'],

		cheese: ['Моцарелла', 'Чеддер', 'Пармезан', 'Дорблю', 'Сыр'],

		meat: ['Курица', 'Бекон', 'Пепперони', 'Ветчина', 'Говядина'],

		components: [
			'Ананас',
			'Лук',
			'Томаты',
			'Базилик',
			'Грибы',
			'Соус BBQ',
			'Томатный соус',
		],
	},

	sushi: {
		fish: ['Лосось', 'Тунец', 'Угорь', 'Треска', 'Осётр'],

		sauce: ['Спайси', 'Терияки', 'Соус унаги', 'Кунжутный', 'Соевый'],

		extras: [
			'Авокадо',
			'Сливочный сыр',
			'Сыр',
			'Огурец',
			'Темпура',
			'Креветка',
			'Рис',
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
