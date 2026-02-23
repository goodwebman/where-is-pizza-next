import { prisma } from './../lib/prisma'
const BASE = 'http://localhost:4000/images'
async function main() {
	const products = await prisma.product.createMany({
		data: [
			// 🍕 PIZZA
			{
				title: 'Пепперони Классик',
				categoryId: 'pizza',
				price: 499,
				imageSrc: `${BASE}/pizzas/pizza1.png`,
				ingredients: JSON.stringify([
					'Пепперони',
					'Моцарелла',
					'Томатный соус',
				]),
			},
			{
				title: 'Маргарита',
				categoryId: 'pizza',
				price: 450,
				imageSrc: `${BASE}/pizzas/pizza2.png`,
				ingredients: JSON.stringify(['Моцарелла', 'Томаты', 'Базилик']),
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
			},
			{
				title: 'Гавайская',
				categoryId: 'pizza',
				price: 510,
				imageSrc: `${BASE}/pizzas/pizza4.png`,
				ingredients: JSON.stringify(['Курица', 'Ананас', 'Сыр', 'Соус']),
			},
			{
				title: 'Барбекю',
				categoryId: 'pizza',
				price: 540,
				imageSrc: `${BASE}/pizzas/pizza5.jpg`,
				ingredients: JSON.stringify(['Говядина', 'Соус BBQ', 'Лук', 'Сыр']),
			},
			{
				title: 'Мясная',
				categoryId: 'pizza',
				price: 590,
				imageSrc: `${BASE}/pizzas/pizza6.jpg`,
				ingredients: JSON.stringify(['Бекон', 'Пепперони', 'Ветчина', 'Сыр']),
			},
			{
				title: 'Пепперони острая',
				categoryId: 'pizza',
				price: 590,
				imageSrc: `${BASE}/pizzas/pizza1.png`,
				ingredients: JSON.stringify(['Бекон', 'Пепперони', 'Ветчина', 'Сыр']),
			},
			{
				title: 'Грибная',
				categoryId: 'pizza',
				price: 420,
				imageSrc: `${BASE}/pizzas/pizza8.png`,
				ingredients: JSON.stringify(['Бекон', 'Пепперони', 'Ветчина', 'Сыр']),
			},

			// 🍣 SUSHI
			{
				title: 'Филадельфия',
				categoryId: 'sushi',
				price: 399,
				imageSrc: `${BASE}/sushi/sushi1.png`,
				ingredients: JSON.stringify(['Лосось', 'Сливочный сыр', 'Рис']),
			},
			{
				title: 'Калифорния',
				categoryId: 'sushi',
				price: 420,
				imageSrc: `${BASE}/sushi/sushi2.png`,
				ingredients: JSON.stringify(['Краб', 'Авокадо', 'Огурец']),
			},
			{
				title: 'Дракон',
				categoryId: 'sushi',
				price: 460,
				imageSrc: `${BASE}/sushi/sushi3.png`,
				ingredients: JSON.stringify(['Угорь', 'Соус унаги', 'Рис']),
			},
			{
				title: 'Темпура ролл',
				categoryId: 'sushi',
				price: 440,
				imageSrc: `${BASE}/sushi/sushi4.png`,
				ingredients: JSON.stringify(['Креветка', 'Темпура', 'Соус']),
			},

			// 🍰 DESSERT
			{
				title: 'Чизкейк Нью-Йорк',
				categoryId: 'dessert',
				price: 290,
				imageSrc: `${BASE}/dessert/dessert1.png`,
				ingredients: JSON.stringify(['Сыр', 'Печенье', 'Крем']),
			},
			{
				title: 'Шоколадный фондан',
				categoryId: 'dessert',
				price: 310,
				imageSrc: `${BASE}/dessert/dessert2.png`,
				ingredients: JSON.stringify(['Шоколад', 'Мука', 'Яйцо']),
			},
			{
				title: 'Тирамису',
				categoryId: 'dessert',
				price: 300,
				imageSrc: `${BASE}/dessert/dessert3.png`,
				ingredients: JSON.stringify(['Маскарпоне', 'Кофе', 'Бисквит']),
			},
			{
				title: 'Панкейки',
				categoryId: 'dessert',
				price: 270,
				imageSrc: `${BASE}/dessert/dessert4.png`,
				ingredients: JSON.stringify(['Тесто', 'Сироп', 'Ягоды']),
			},
			{
				title: 'Мороженое',
				categoryId: 'dessert',
				price: 190,
				imageSrc: `${BASE}/dessert/dessert5.png`,
				ingredients: JSON.stringify(['Молоко', 'Сахар', 'Ваниль']),
			},
			{
				title: 'Брауни',
				categoryId: 'dessert',
				price: 260,
				imageSrc: `${BASE}/dessert/dessert6.png`,
				ingredients: JSON.stringify(['Шоколад', 'Орехи', 'Масло']),
			},

			// 🥤 DRINKS
			{
				title: 'Кола',
				categoryId: 'drinks',
				price: 150,
				imageSrc: `${BASE}/drinks/drinks1.png`,
				ingredients: JSON.stringify(['Газировка']),
			},
			{
				title: 'Фанта',
				categoryId: 'drinks',
				price: 150,
				imageSrc: `${BASE}/drinks/drinks2.png`,
				ingredients: JSON.stringify(['Газировка']),
			},
			{
				title: 'Спрайт',
				categoryId: 'drinks',
				price: 150,
				imageSrc: `${BASE}/drinks/drinks3.png`,
				ingredients: JSON.stringify(['Газировка']),
			},
			{
				title: 'Апельсиновый сок',
				categoryId: 'drinks',
				price: 190,
				imageSrc: `${BASE}/drinks/drinks4.png`,
				ingredients: JSON.stringify(['Сок']),
			},
			{
				title: 'Кофе латте',
				categoryId: 'drinks',
				price: 210,
				imageSrc: `${BASE}/drinks/drinks5.png`,
				ingredients: JSON.stringify(['Кофе', 'Молоко']),
			},
			{
				title: 'Чай зелёный',
				categoryId: 'drinks',
				price: 160,
				imageSrc: `${BASE}/drinks/drinks6.png`,
				ingredients: JSON.stringify(['Чай']),
			},

			// 🥫 SAUCE
			{
				title: 'Соус сырный',
				categoryId: 'sauce',
				price: 70,
				imageSrc: `${BASE}/sauce/sauce1.png`,
				ingredients: JSON.stringify(['Сыр', 'Сливки']),
			},
			{
				title: 'Соус чесночный',
				categoryId: 'sauce',
				price: 70,
				imageSrc: `${BASE}/sauce/sauce2.png`,
				ingredients: JSON.stringify(['Чеснок', 'Майонез']),
			},
			{
				title: 'Соус BBQ',
				categoryId: 'sauce',
				price: 80,
				imageSrc: `${BASE}/sauce/sauce3.png`,
				ingredients: JSON.stringify(['Томат', 'Специи']),
			},
			{
				title: 'Соус терияки',
				categoryId: 'sauce',
				price: 80,
				imageSrc: `${BASE}/sauce/sauce4.png`,
				ingredients: JSON.stringify(['Соевый соус', 'Сахар']),
			},
			{
				title: 'Соус острый',
				categoryId: 'sauce',
				price: 75,
				imageSrc: `${BASE}/sauce/sauce5.png`,
				ingredients: JSON.stringify(['Перец', 'Специи']),
			},

			// 🍟 SNACKS
			{
				title: 'Картофель фри',
				categoryId: 'snacks',
				price: 220,
				imageSrc: `${BASE}/snacks/snacks1.png`,
				ingredients: JSON.stringify(['Картофель', 'Соль']),
			},
			{
				title: 'Наггетсы',
				categoryId: 'snacks',
				price: 260,
				imageSrc: `${BASE}/snacks/snacks2.png`,
				ingredients: JSON.stringify(['Курица', 'Панировка']),
			},
			{
				title: 'Луковые кольца',
				categoryId: 'snacks',
				price: 240,
				imageSrc: `${BASE}/snacks/snacks3.png`,
				ingredients: JSON.stringify(['Лук', 'Кляр']),
			},
			{
				title: 'Крылья BBQ',
				categoryId: 'snacks',
				price: 320,
				imageSrc: `${BASE}/snacks/snacks4.png`,
				ingredients: JSON.stringify(['Курица', 'Соус BBQ']),
			},

			// 🍱 COMBOS
			{
				title: 'Комбо Пицца + Кола',
				categoryId: 'combos',
				price: 650,
				imageSrc: `${BASE}/combos/combos1.png`,
				ingredients: JSON.stringify(['Пицца', 'Напиток']),
			},
			{
				title: 'Комбо Суши сет',
				categoryId: 'combos',
				price: 890,
				imageSrc: `${BASE}/combos/combos2.png`,
				ingredients: JSON.stringify(['Роллы ассорти']),
			},
			{
				title: 'Комбо Фри + Наггетсы',
				categoryId: 'combos',
				price: 520,
				imageSrc: `${BASE}/combos/combos3.png`,
				ingredients: JSON.stringify(['Фри', 'Наггетсы']),
			},
			{
				title: 'Комбо Пицца мини',
				categoryId: 'combos',
				price: 590,
				imageSrc: `${BASE}/combos/combos4.png`,
				ingredients: JSON.stringify(['Мини пицца', 'Соус']),
			},
		],
	})
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
