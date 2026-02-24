import { randomUUID } from 'node:crypto'
import { prisma } from './../lib/prisma'

const BASE = 'http://localhost:4000/images'
async function main() {
	await prisma.productOptionValue.deleteMany()
	await prisma.productOption.deleteMany()
	await prisma.nutrition.deleteMany()
	await prisma.product.deleteMany()
	const pizzaOptions = [
		{
			id: 'size',
			title: 'Размер',
			type: 'single' as const,
			required: true,
			values: [
				{ id: '25', title: '25 см' },
				{ id: '30', title: '30 см', price: 80 },
				{ id: '35', title: '35 см', price: 140 },
			],
		},
		{
			id: 'dough',
			title: 'Тип теста',
			type: 'single' as const,
			values: [
				{ id: 'classic', title: 'Классическое' },
				{ id: 'thin', title: 'Тонкое' },
			],
		},
		{
			id: 'extra',
			title: 'Дополнительно',
			type: 'multiple' as const,
			values: [
				{ id: 'cheese', title: 'Доп сыр', price: 50 },
				{ id: 'bacon', title: 'Бекон', price: 70 },
			],
		},
	]

	const sushiOptions = [
		{
			id: 'size',
			title: 'Размер порции',
			type: 'single' as const,
			required: true,
			values: [
				{ id: '6', title: '6 шт' },
				{ id: '8', title: '8 шт', price: 60 },
				{ id: '12', title: '12 шт', price: 120 },
			],
		},
		{
			id: 'sauce',
			title: 'Соус',
			type: 'single' as const,
			values: [
				{ id: 'soy', title: 'Соевый' },
				{ id: 'spicy', title: 'Спайси' },
				{ id: 'teriyaki', title: 'Терияки' },
			],
		},
	]

	const drinkOptions = [
		{
			id: 'volume',
			title: 'Объём',
			type: 'single' as const,
			required: true,
			values: [
				{ id: '0.3', title: '0.3 л' },
				{ id: '0.5', title: '0.5 л', price: 40 },
				{ id: '1', title: '1 л', price: 80 },
			],
		},
	]

	type OptionValue = { id?: string; title: string; price?: number }
	type ProductOptionType = {
		id: string
		title: string
		type: 'single' | 'multiple'
		required?: boolean
		values: OptionValue[]
	}

	type ProductSeed = {
		title: string
		categoryId: string
		price: number
		imageSrc: string
		ingredients: string
		nutrition: {
			caloriesPer100g: number
		}
		options: ProductOptionType[]
	}
	const productsData: ProductSeed[] = [
		// 🍕 PIZZA
		{
			title: 'Пепперони Классик',
			categoryId: 'pizza',
			price: 499,
			imageSrc: `${BASE}/pizzas/pizza1.png`,
			ingredients: JSON.stringify(['Пепперони', 'Моцарелла', 'Томатный соус']),
			nutrition: { caloriesPer100g: 260 },
			options: pizzaOptions,
		},
		{
			title: 'Маргарита',
			categoryId: 'pizza',
			price: 450,
			imageSrc: `${BASE}/pizzas/pizza2.png`,
			ingredients: JSON.stringify(['Моцарелла', 'Томаты', 'Базилик']),
			nutrition: { caloriesPer100g: 160 },
			options: pizzaOptions,
		},
		{
			title: '4 сыра',
			categoryId: 'pizza',
			price: 520,
			imageSrc: `${BASE}/pizzas/pizza3.png`,
			ingredients: JSON.stringify([
				'Моцарелла',
				'Чеддер',
				'Дорблю',
				'Пармезан',
			]),
			nutrition: { caloriesPer100g: 360 },
			options: pizzaOptions,
		},
		{
			title: 'Гавайская',
			categoryId: 'pizza',
			price: 510,
			imageSrc: `${BASE}/pizzas/pizza4.png`,
			ingredients: JSON.stringify(['Курица', 'Ананас', 'Сыр', 'Соус']),
			nutrition: { caloriesPer100g: 190 },
			options: pizzaOptions,
		},
		{
			title: 'Барбекю',
			categoryId: 'pizza',
			price: 540,
			imageSrc: `${BASE}/pizzas/pizza5.jpg`,
			ingredients: JSON.stringify(['Говядина', 'Соус BBQ', 'Лук', 'Сыр']),
			nutrition: { caloriesPer100g: 460 },
			options: pizzaOptions,
		},
		{
			title: 'Мясная',
			categoryId: 'pizza',
			price: 590,
			imageSrc: `${BASE}/pizzas/pizza6.jpg`,
			ingredients: JSON.stringify(['Бекон', 'Пепперони', 'Ветчина', 'Сыр']),
			nutrition: { caloriesPer100g: 360 },
			options: pizzaOptions,
		},
		{
			title: 'Пепперони острая',
			categoryId: 'pizza',
			price: 590,
			imageSrc: `${BASE}/pizzas/pizza1.png`,
			ingredients: JSON.stringify(['Бекон', 'Пепперони', 'Ветчина', 'Сыр']),
			nutrition: { caloriesPer100g: 290 },
			options: pizzaOptions,
		},
		{
			title: 'Грибная',
			categoryId: 'pizza',
			price: 420,
			imageSrc: `${BASE}/pizzas/pizza8.png`,
			ingredients: JSON.stringify(['Бекон', 'Пепперони', 'Ветчина', 'Сыр']),
			nutrition: { caloriesPer100g: 260 },
			options: pizzaOptions,
		},

		// 🍣 SUSHI
		{
			title: 'Филадельфия',
			categoryId: 'sushi',
			price: 399,
			imageSrc: `${BASE}/sushi/sushi1.png`,
			ingredients: JSON.stringify(['Лосось', 'Сливочный сыр', 'Рис']),
			nutrition: { caloriesPer100g: 180 },
			options: sushiOptions,
		},
		{
			title: 'Калифорния',
			categoryId: 'sushi',
			price: 420,
			imageSrc: `${BASE}/sushi/sushi2.png`,
			ingredients: JSON.stringify(['Краб', 'Авокадо', 'Огурец']),
			nutrition: { caloriesPer100g: 180 },
			options: sushiOptions,
		},
		{
			title: 'Дракон',
			categoryId: 'sushi',
			price: 460,
			imageSrc: `${BASE}/sushi/sushi3.png`,
			ingredients: JSON.stringify(['Угорь', 'Соус унаги', 'Рис']),
			nutrition: { caloriesPer100g: 180 },
			options: sushiOptions,
		},
		{
			title: 'Темпура ролл',
			categoryId: 'sushi',
			price: 440,
			imageSrc: `${BASE}/sushi/sushi4.png`,
			ingredients: JSON.stringify(['Креветка', 'Темпура', 'Соус']),
			nutrition: { caloriesPer100g: 180 },
			options: sushiOptions,
		},

		// 🍰 DESSERT
		{
			title: 'Чизкейк Нью-Йорк',
			categoryId: 'dessert',
			price: 290,
			imageSrc: `${BASE}/dessert/dessert1.png`,
			ingredients: JSON.stringify(['Сыр', 'Печенье', 'Крем']),
			nutrition: { caloriesPer100g: 320 },
			options: [],
		},
		{
			title: 'Шоколадный фондан',
			categoryId: 'dessert',
			price: 310,
			imageSrc: `${BASE}/dessert/dessert2.png`,
			ingredients: JSON.stringify(['Шоколад', 'Мука', 'Яйцо']),
			nutrition: { caloriesPer100g: 330 },
			options: [],
		},
		{
			title: 'Тирамису',
			categoryId: 'dessert',
			price: 300,
			imageSrc: `${BASE}/dessert/dessert3.png`,
			ingredients: JSON.stringify(['Маскарпоне', 'Кофе', 'Бисквит']),
			nutrition: { caloriesPer100g: 380 },
			options: [],
		},
		{
			title: 'Панкейки',
			categoryId: 'dessert',
			price: 270,
			imageSrc: `${BASE}/dessert/dessert4.png`,
			ingredients: JSON.stringify(['Тесто', 'Сироп', 'Ягоды']),
			nutrition: { caloriesPer100g: 390 },
			options: [],
		},
		{
			title: 'Мороженое',
			categoryId: 'dessert',
			price: 190,
			imageSrc: `${BASE}/dessert/dessert5.png`,
			ingredients: JSON.stringify(['Молоко', 'Сахар', 'Ваниль']),
			nutrition: { caloriesPer100g: 320 },
			options: [],
		},
		{
			title: 'Брауни',
			categoryId: 'dessert',
			price: 260,
			imageSrc: `${BASE}/dessert/dessert6.png`,
			ingredients: JSON.stringify(['Шоколад', 'Орехи', 'Масло']),
			nutrition: { caloriesPer100g: 320 },
			options: [],
		},

		// 🥤 DRINKS
		{
			title: 'Кола',
			categoryId: 'drinks',
			price: 150,
			imageSrc: `${BASE}/drinks/drinks1.png`,
			ingredients: JSON.stringify(['Газировка']),
			nutrition: { caloriesPer100g: 42 },
			options: drinkOptions,
		},
		{
			title: 'Фанта',
			categoryId: 'drinks',
			price: 150,
			imageSrc: `${BASE}/drinks/drinks2.png`,
			ingredients: JSON.stringify(['Газировка']),
			nutrition: { caloriesPer100g: 42 },
			options: drinkOptions,
		},
		{
			title: 'Спрайт',
			categoryId: 'drinks',
			price: 150,
			imageSrc: `${BASE}/drinks/drinks3.png`,
			ingredients: JSON.stringify(['Газировка']),
			nutrition: { caloriesPer100g: 42 },
			options: drinkOptions,
		},
		{
			title: 'Апельсиновый сок',
			categoryId: 'drinks',
			price: 190,
			imageSrc: `${BASE}/drinks/drinks4.png`,
			ingredients: JSON.stringify(['Сок']),
			nutrition: { caloriesPer100g: 42 },
			options: drinkOptions,
		},
		{
			title: 'Кофе латте',
			categoryId: 'drinks',
			price: 210,
			imageSrc: `${BASE}/drinks/drinks5.png`,
			ingredients: JSON.stringify(['Кофе', 'Молоко']),
			nutrition: { caloriesPer100g: 42 },
			options: drinkOptions,
		},
		{
			title: 'Чай зелёный',
			categoryId: 'drinks',
			price: 160,
			imageSrc: `${BASE}/drinks/drinks6.png`,
			ingredients: JSON.stringify(['Чай']),
			nutrition: { caloriesPer100g: 42 },
			options: drinkOptions,
		},

		// 🥫 SAUCE
		{
			title: 'Соус сырный',
			categoryId: 'sauce',
			price: 70,
			imageSrc: `${BASE}/sauce/sauce1.png`,
			ingredients: JSON.stringify(['Сыр', 'Сливки']),
			nutrition: { caloriesPer100g: 300 },
			options: [],
		},
		{
			title: 'Соус чесночный',
			categoryId: 'sauce',
			price: 70,
			imageSrc: `${BASE}/sauce/sauce2.png`,
			ingredients: JSON.stringify(['Чеснок', 'Майонез']),
			nutrition: { caloriesPer100g: 300 },
			options: [],
		},
		{
			title: 'Соус BBQ',
			categoryId: 'sauce',
			price: 80,
			imageSrc: `${BASE}/sauce/sauce3.png`,
			ingredients: JSON.stringify(['Томат', 'Специи']),
			nutrition: { caloriesPer100g: 300 },
			options: [],
		},
		{
			title: 'Соус терияки',
			categoryId: 'sauce',
			price: 80,
			imageSrc: `${BASE}/sauce/sauce4.png`,
			ingredients: JSON.stringify(['Соевый соус', 'Сахар']),
			nutrition: { caloriesPer100g: 300 },
			options: [],
		},
		{
			title: 'Соус острый',
			categoryId: 'sauce',
			price: 75,
			imageSrc: `${BASE}/sauce/sauce5.png`,
			ingredients: JSON.stringify(['Перец', 'Специи']),
			nutrition: { caloriesPer100g: 300 },
			options: [],
		},

		// 🍟 SNACKS
		{
			title: 'Картофель фри',
			categoryId: 'snacks',
			price: 220,
			imageSrc: `${BASE}/snacks/snacks1.png`,
			ingredients: JSON.stringify(['Картофель', 'Соль']),
			nutrition: { caloriesPer100g: 280 },
			options: [],
		},
		{
			title: 'Наггетсы',
			categoryId: 'snacks',
			price: 260,
			imageSrc: `${BASE}/snacks/snacks2.png`,
			ingredients: JSON.stringify(['Курица', 'Панировка']),
			nutrition: { caloriesPer100g: 280 },
			options: [],
		},
		{
			title: 'Луковые кольца',
			categoryId: 'snacks',
			price: 240,
			imageSrc: `${BASE}/snacks/snacks3.png`,
			ingredients: JSON.stringify(['Лук', 'Кляр']),
			nutrition: { caloriesPer100g: 280 },
			options: [],
		},
		{
			title: 'Крылья BBQ',
			categoryId: 'snacks',
			price: 320,
			imageSrc: `${BASE}/snacks/snacks4.png`,
			ingredients: JSON.stringify(['Курица', 'Соус BBQ']),
			nutrition: { caloriesPer100g: 280 },
			options: [],
		},

		// 🍱 COMBOS
		{
			title: 'Комбо Пицца + Кола',
			categoryId: 'combos',
			price: 650,
			imageSrc: `${BASE}/combos/combos1.png`,
			ingredients: JSON.stringify(['Пицца', 'Напиток']),
			nutrition: { caloriesPer100g: 280 },
			options: [],
		},
		{
			title: 'Комбо Суши сет',
			categoryId: 'combos',
			price: 890,
			imageSrc: `${BASE}/combos/combos2.png`,
			ingredients: JSON.stringify(['Роллы ассорти']),
			nutrition: { caloriesPer100g: 280 },
			options: [],
		},
		{
			title: 'Комбо Фри + Наггетсы',
			categoryId: 'combos',
			price: 520,
			imageSrc: `${BASE}/combos/combos3.png`,
			ingredients: JSON.stringify(['Фри', 'Наггетсы']),
			nutrition: { caloriesPer100g: 280 },
			options: [],
		},
		{
			title: 'Комбо Пицца мини',
			categoryId: 'combos',
			price: 590,
			imageSrc: `${BASE}/combos/combos4.png`,
			ingredients: JSON.stringify(['Мини пицца', 'Соус']),
			nutrition: { caloriesPer100g: 280 },
			options: [],
		},
	]

	for (const p of productsData) {
		await prisma.product.create({
			data: {
				title: p.title,
				categoryId: p.categoryId,
				price: p.price,
				imageSrc: p.imageSrc,
				ingredients: p.ingredients,

				nutrition: {
					create: {
						caloriesPer100g: p.nutrition.caloriesPer100g,
					},
				},

				options: {
					create: p.options.map(option => ({
						id: randomUUID(),
						title: option.title,
						type: option.type,
						required: option.required ?? false,
						values: {
							create: option.values.map(v => ({
								title: v.title,
								price: v.price ?? null,
							})),
						},
					})),
				},
			},
		})
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
