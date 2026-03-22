"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const prisma_1 = require("./../lib/prisma");
const BASE = 'http://localhost:4000/images';
async function main() {
    await prisma_1.prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF`);
    await prisma_1.prisma.product.deleteMany();
    await prisma_1.prisma.productOption.deleteMany();
    await prisma_1.prisma.productOptionValue.deleteMany();
    await prisma_1.prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON`);
    const pizzaOptions = [
        {
            id: 'size',
            title: 'Размер',
            type: 'single',
            required: true,
            values: [
                { slug: '25', title: '25 см', weight: 420 },
                { slug: '30', title: '30 см', price: 80, weight: 560 },
                { slug: '35', title: '35 см', price: 140, weight: 720 },
            ],
        },
        {
            id: 'dough',
            title: 'Тип теста',
            type: 'single',
            values: [
                { slug: 'classic', title: 'Классическое' },
                { slug: 'thin', title: 'Тонкое' },
            ],
        },
        {
            id: 'extra',
            title: 'Дополнительно',
            type: 'multiple',
            values: [
                { slug: 'cheese', title: 'Доп сыр', price: 59, weight: 40 },
                { slug: 'champignons', title: 'Шампиньоны', price: 69, weight: 30 },
                { slug: 'red_onion', title: 'Красный лук', price: 69, weight: 20 },
                { slug: 'sweet_papper', title: 'Сладкий перец', price: 59, weight: 25 },
            ],
        },
    ];
    const sushiOptions = [
        {
            id: 'size',
            title: 'Размер порции',
            type: 'single',
            required: true,
            values: [
                { slug: '6', title: '6 шт', weight: 180 },
                { slug: '8', title: '8 шт', price: 60, weight: 240 },
                { slug: '12', title: '12 шт', price: 120, weight: 360 },
            ],
        },
        {
            id: 'sauce',
            title: 'Соус',
            type: 'single',
            values: [
                { slug: 'soy', title: 'Соевый' },
                { slug: 'spicy', title: 'Спайси' },
                { slug: 'teriyaki', title: 'Терияки' },
            ],
        },
    ];
    const drinkOptions = [
        {
            id: 'volume',
            title: 'Объём',
            type: 'single',
            required: true,
            values: [
                { slug: '0.3', title: '0.3 л', weight: 300 },
                { slug: '0.5', title: '0.5 л', price: 40, weight: 500 },
                { slug: '1', title: '1 л', price: 80, weight: 1000 },
            ],
        },
    ];
    const productsData = [
        // 🍕 PIZZA
        {
            title: 'Пепперони Классик',
            categoryId: 'pizza',
            price: 499,
            imageSrc: `${BASE}/pizzas/pizza1.png`,
            ingredients: [
                { id: 'pepperoni', label: 'Пепперони' },
                { id: 'cheese', label: 'Сыр' },
                { id: 'tomato_sauce', label: 'Томатный соус' },
            ],
            nutrition: { caloriesPer100g: 260 },
            options: pizzaOptions,
        },
        {
            title: 'Маргарита',
            categoryId: 'pizza',
            price: 450,
            imageSrc: `${BASE}/pizzas/pizza2.png`,
            ingredients: [
                { id: 'cheese', label: 'Сыр' },
                { id: 'tomato_sauce', label: 'Томатный соус' },
                { id: 'cherry', label: 'Томаты черри' },
            ],
            nutrition: { caloriesPer100g: 160 },
            options: pizzaOptions,
        },
        {
            title: '4 сыра',
            categoryId: 'pizza',
            price: 520,
            imageSrc: `${BASE}/pizzas/pizza3.png`,
            ingredients: [
                { id: 'cheese1', label: 'Маздам' },
                { id: 'cheese2', label: 'Маскарпоне' },
                { id: 'cheese3', label: 'Советский' },
                { id: 'cheese4', label: 'Белорусский' },
            ],
            nutrition: { caloriesPer100g: 360 },
            options: pizzaOptions,
        },
        {
            title: 'Гавайская',
            categoryId: 'pizza',
            price: 510,
            imageSrc: `${BASE}/pizzas/pizza4.png`,
            ingredients: [
                { id: 'chicken', label: 'Курица' },
                { id: 'orange', label: 'Ананас' },
                { id: 'cheese', label: 'Сыр' },
                { id: 'tomato_sauce', label: 'Соус' },
            ],
            nutrition: { caloriesPer100g: 190 },
            options: pizzaOptions,
        },
        {
            title: 'Барбекю',
            categoryId: 'pizza',
            price: 540,
            imageSrc: `${BASE}/pizzas/pizza5.jpg`,
            ingredients: [
                { id: 'meat', label: 'Мясо' },
                { id: 'red_onion', label: 'Лук' },
                { id: 'cheese', label: 'Сыр' },
                { id: 'tomato_sauce', label: 'Соус BBQ' },
            ],
            nutrition: { caloriesPer100g: 460 },
            options: pizzaOptions,
        },
        {
            title: 'Мясная',
            categoryId: 'pizza',
            price: 590,
            imageSrc: `${BASE}/pizzas/pizza6.jpg`,
            ingredients: [
                { id: 'meat', label: 'Мясо' },
                { id: 'sausage', label: 'Колбаски' },
                { id: 'pepperoni', label: 'Пепперони' },
                { id: 'cheese', label: 'Сыр' },
            ],
            nutrition: { caloriesPer100g: 360 },
            options: pizzaOptions,
        },
        {
            title: 'Пепперони острая',
            categoryId: 'pizza',
            price: 590,
            imageSrc: `${BASE}/pizzas/pizza1.png`,
            ingredients: [
                { id: 'pepperoni', label: 'Пепперони' },
                { id: 'sausage', label: 'Острая колбаса' },
                { id: 'cheese', label: 'Сыр' },
                { id: 'tomato_sauce', label: 'Соус' },
            ],
            nutrition: { caloriesPer100g: 290 },
            options: pizzaOptions,
        },
        {
            title: 'Грибная',
            categoryId: 'pizza',
            price: 420,
            imageSrc: `${BASE}/pizzas/pizza8.png`,
            ingredients: [
                { id: 'champignons', label: 'Шампиньоны' },
                { id: 'cheese', label: 'Сыр' },
                { id: 'tomato_sauce', label: 'Соус' },
            ],
            nutrition: { caloriesPer100g: 260 },
            options: pizzaOptions,
        },
        // 🍣 SUSHI
        {
            title: 'Филадельфия',
            categoryId: 'sushi',
            price: 399,
            imageSrc: `${BASE}/sushi/sushi1.png`,
            ingredients: [
                { id: 'prawn', label: 'Рыба/морепродукты' },
                { id: 'cheese', label: 'Сливочный сыр' },
                { id: 'rice_bowl', label: 'Рис' },
            ],
            nutrition: { caloriesPer100g: 180 },
            options: sushiOptions,
        },
        {
            title: 'Калифорния',
            categoryId: 'sushi',
            price: 420,
            imageSrc: `${BASE}/sushi/sushi2.png`,
            ingredients: [
                { id: 'prawn', label: 'Краб/морепродукты' },
                { id: 'eggplant', label: 'Авокадо' },
                { id: 'carrot', label: 'Овощи' },
            ],
            nutrition: { caloriesPer100g: 180 },
            options: sushiOptions,
        },
        {
            title: 'Дракон',
            categoryId: 'sushi',
            price: 460,
            imageSrc: `${BASE}/sushi/sushi3.png`,
            ingredients: [
                { id: 'meat', label: 'Угорь' },
                { id: 'rice_bowl', label: 'Рис' },
            ],
            nutrition: { caloriesPer100g: 180 },
            options: sushiOptions,
        },
        {
            title: 'Темпура ролл',
            categoryId: 'sushi',
            price: 440,
            imageSrc: `${BASE}/sushi/sushi4.png`,
            ingredients: [
                { id: 'prawn', label: 'Креветка' },
                { id: 'rice_bowl', label: 'Рис' },
            ],
            nutrition: { caloriesPer100g: 180 },
            options: sushiOptions,
        },
        // 🍰 DESSERT
        {
            title: 'Чизкейк Нью-Йорк',
            categoryId: 'dessert',
            price: 290,
            imageSrc: `${BASE}/dessert/dessert1.png`,
            ingredients: [{ id: 'cheese', label: 'Сыр' }],
            nutrition: { caloriesPer100g: 320 },
            options: [],
        },
        {
            title: 'Шоколадный фондан',
            categoryId: 'dessert',
            price: 310,
            imageSrc: `${BASE}/dessert/dessert2.png`,
            ingredients: [{ id: 'orange', label: 'Апельсин' }],
            nutrition: { caloriesPer100g: 330 },
            options: [],
        },
        {
            title: 'Тирамису',
            categoryId: 'dessert',
            price: 300,
            imageSrc: `${BASE}/dessert/dessert3.png`,
            ingredients: [{ id: 'cheese', label: 'Крем' }],
            nutrition: { caloriesPer100g: 380 },
            options: [],
        },
        {
            title: 'Панкейки',
            categoryId: 'dessert',
            price: 270,
            imageSrc: `${BASE}/dessert/dessert4.png`,
            ingredients: [{ id: 'milk', label: 'Молоко' }],
            nutrition: { caloriesPer100g: 390 },
            options: [],
        },
        {
            title: 'Мороженое',
            categoryId: 'dessert',
            price: 190,
            imageSrc: `${BASE}/dessert/dessert5.png`,
            ingredients: [{ id: 'cherry', label: 'Вишня' }],
            nutrition: { caloriesPer100g: 320 },
            options: [],
        },
        {
            title: 'Брауни',
            categoryId: 'dessert',
            price: 260,
            imageSrc: `${BASE}/dessert/dessert6.png`,
            ingredients: [{ id: 'strawberry', label: 'Клубника' }],
            nutrition: { caloriesPer100g: 320 },
            options: [],
        },
        // 🥤 DRINKS
        {
            title: 'Кола',
            categoryId: 'drinks',
            price: 150,
            imageSrc: `${BASE}/drinks/drinks1.png`,
            ingredients: [{ id: 'orange', label: 'Напиток' }],
            nutrition: { caloriesPer100g: 42 },
            options: drinkOptions,
        },
        {
            title: 'Фанта',
            categoryId: 'drinks',
            price: 150,
            imageSrc: `${BASE}/drinks/drinks2.png`,
            ingredients: [{ id: 'orange', label: 'Апельсин' }],
            nutrition: { caloriesPer100g: 42 },
            options: drinkOptions,
        },
        {
            title: 'Спрайт',
            categoryId: 'drinks',
            price: 150,
            imageSrc: `${BASE}/drinks/drinks3.png`,
            ingredients: [{ id: 'orange', label: 'Цитрус' }],
            nutrition: { caloriesPer100g: 42 },
            options: drinkOptions,
        },
        {
            title: 'Апельсиновый сок',
            categoryId: 'drinks',
            price: 190,
            imageSrc: `${BASE}/drinks/drinks4.png`,
            ingredients: [{ id: 'orange', label: 'Апельсин' }],
            nutrition: { caloriesPer100g: 42 },
            options: drinkOptions,
        },
        {
            title: 'Кофе латте',
            categoryId: 'drinks',
            price: 210,
            imageSrc: `${BASE}/drinks/drinks5.png`,
            ingredients: [{ id: 'milk', label: 'Молоко' }],
            nutrition: { caloriesPer100g: 42 },
            options: drinkOptions,
        },
        {
            title: 'Чай зелёный',
            categoryId: 'drinks',
            price: 160,
            imageSrc: `${BASE}/drinks/drinks6.png`,
            ingredients: [{ id: 'carrot', label: 'Растительный ингредиент' }],
            nutrition: { caloriesPer100g: 42 },
            options: drinkOptions,
        },
        // 🥫 SAUCE
        {
            title: 'Соус сырный',
            categoryId: 'sauce',
            price: 70,
            imageSrc: `${BASE}/sauce/sauce1.png`,
            ingredients: [{ id: 'cheese', label: 'Сыр' }],
            nutrition: { caloriesPer100g: 300 },
            options: [],
        },
        {
            title: 'Соус чесночный',
            categoryId: 'sauce',
            price: 70,
            imageSrc: `${BASE}/sauce/sauce2.png`,
            ingredients: [{ id: 'garlic', label: 'Чеснок' }],
            nutrition: { caloriesPer100g: 300 },
            options: [],
        },
        {
            title: 'Соус BBQ',
            categoryId: 'sauce',
            price: 80,
            imageSrc: `${BASE}/sauce/sauce3.png`,
            ingredients: [{ id: 'tomato_sauce', label: 'Томатная основа' }],
            nutrition: { caloriesPer100g: 300 },
            options: [],
        },
        {
            title: 'Соус терияки',
            categoryId: 'sauce',
            price: 80,
            imageSrc: `${BASE}/sauce/sauce4.png`,
            ingredients: [{ id: 'tomato_sauce', label: 'Соус' }],
            nutrition: { caloriesPer100g: 300 },
            options: [],
        },
        {
            title: 'Соус острый',
            categoryId: 'sauce',
            price: 75,
            imageSrc: `${BASE}/sauce/sauce5.png`,
            ingredients: [{ id: 'sweet_papper', label: 'Перец' }],
            nutrition: { caloriesPer100g: 300 },
            options: [],
        },
        // 🍟 SNACKS
        {
            title: 'Картофель фри',
            categoryId: 'snacks',
            price: 220,
            imageSrc: `${BASE}/snacks/snacks1.png`,
            ingredients: [{ id: 'carrot', label: 'Овощи' }],
            nutrition: { caloriesPer100g: 280 },
            options: [],
        },
        {
            title: 'Наггетсы',
            categoryId: 'snacks',
            price: 260,
            imageSrc: `${BASE}/snacks/snacks2.png`,
            ingredients: [{ id: 'chicken', label: 'Курица' }],
            nutrition: { caloriesPer100g: 280 },
            options: [],
        },
        {
            title: 'Луковые кольца',
            categoryId: 'snacks',
            price: 240,
            imageSrc: `${BASE}/snacks/snacks3.png`,
            ingredients: [{ id: 'red_onion', label: 'Лук' }],
            nutrition: { caloriesPer100g: 280 },
            options: [],
        },
        {
            title: 'Крылья BBQ',
            categoryId: 'snacks',
            price: 320,
            imageSrc: `${BASE}/snacks/snacks4.png`,
            ingredients: [
                { id: 'chicken', label: 'Курица' },
                { id: 'tomato_sauce', label: 'Соус BBQ' },
            ],
            nutrition: { caloriesPer100g: 280 },
            options: [],
        },
        // 🍱 COMBOS
        {
            title: 'Комбо Пицца + Кола',
            categoryId: 'combos',
            price: 650,
            imageSrc: `${BASE}/combos/combos1.png`,
            ingredients: [
                { id: 'cheese', label: 'Пицца' },
                { id: 'orange', label: 'Напиток' },
            ],
            nutrition: { caloriesPer100g: 280 },
            options: [],
        },
        {
            title: 'Комбо Суши сет',
            categoryId: 'combos',
            price: 890,
            imageSrc: `${BASE}/combos/combos2.png`,
            ingredients: [{ id: 'rice_bowl', label: 'Сет роллов' }],
            nutrition: { caloriesPer100g: 280 },
            options: [],
        },
        {
            title: 'Комбо Фри + Наггетсы',
            categoryId: 'combos',
            price: 520,
            imageSrc: `${BASE}/combos/combos3.png`,
            ingredients: [
                { id: 'carrot', label: 'Фри' },
                { id: 'chicken', label: 'Наггетсы' },
            ],
            nutrition: { caloriesPer100g: 280 },
            options: [],
        },
        {
            title: 'Комбо Пицца мини',
            categoryId: 'combos',
            price: 590,
            imageSrc: `${BASE}/combos/combos4.png`,
            ingredients: [
                { id: 'cheese', label: 'Мини пицца' },
                { id: 'tomato_sauce', label: 'Соус' },
            ],
            nutrition: { caloriesPer100g: 280 },
            options: [],
        },
    ];
    for (const p of productsData) {
        await prisma_1.prisma.product.create({
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
                        id: (0, node_crypto_1.randomUUID)(),
                        title: option.title,
                        type: option.type,
                        required: option.required ?? false,
                        values: {
                            create: option.values.map(v => ({
                                title: v.title,
                                slug: v.slug,
                                price: v.price ?? null,
                                weight: v.weight ?? null,
                            })),
                        },
                    })),
                },
            },
        });
    }
}
main()
    .then(async () => {
    await prisma_1.prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma_1.prisma.$disconnect();
    process.exit(1);
});
