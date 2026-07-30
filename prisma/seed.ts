import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/server/db/generated/client';

/**
 * Relative, because images are now served by Next from public/images. Baking an
 * absolute origin into the database is what tied the old seed to localhost:4000.
 */
const BASE = '/images';

type SeedOptionValue = {
  slug: string;
  title: string;
  price?: number;
  weight?: number;
};

type SeedOption = {
  key: string;
  title: string;
  type: 'single' | 'multiple';
  required?: boolean;
  values: SeedOptionValue[];
};

type SeedProduct = {
  title: string;
  categoryId: string;
  price: number;
  imageSrc: string;
  ingredients: { id: string; label: string }[];
  nutrition: { caloriesPer100g: number };
  options: SeedOption[];
};

const pizzaOptions: SeedOption[] = [
  {
    key: 'size',
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
    key: 'dough',
    title: 'Тип теста',
    type: 'single',
    values: [
      { slug: 'classic', title: 'Классическое' },
      { slug: 'thin', title: 'Тонкое' },
    ],
  },
  {
    key: 'extra',
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

const sushiOptions: SeedOption[] = [
  {
    key: 'size',
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
    key: 'sauce',
    title: 'Соус',
    type: 'single',
    values: [
      { slug: 'soy', title: 'Соевый' },
      { slug: 'spicy', title: 'Спайси' },
      { slug: 'teriyaki', title: 'Терияки' },
    ],
  },
];

const drinkOptions: SeedOption[] = [
  {
    key: 'volume',
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

const productsData: SeedProduct[] = [
  // PIZZA
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

  // SUSHI
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

  // DESSERT
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

  // DRINKS
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

  // SAUCE
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

  // SNACKS
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

  // COMBOS
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

/**
 * Deterministic ids, so re-seeding is idempotent and e2e fixtures can address a
 * product without querying for it first. The old seed used randomUUID(), which
 * meant every run orphaned existing orders and invalidated any hard-coded id.
 */
const productId = (categoryId: string, index: number) =>
  `${categoryId}-${index + 1}`;

const optionId = (product: string, key: string) => `${product}:${key}`;

const optionValueId = (option: string, slug: string) => `${option}:${slug}`;

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      // Prefers the direct connection: the seed runs dozens of statements in a
      // row, and DATABASE_URL_UNPOOLED is the name Vercel's Neon integration
      // uses.
      connectionString:
        process.env.DIRECT_DATABASE_URL ??
        process.env.DATABASE_URL_UNPOOLED ??
        process.env.DATABASE_URL,
    }),
  });

  try {
    const perCategoryCount = new Map<string, number>();
    const seededProductIds: string[] = [];

    for (const product of productsData) {
      const index = perCategoryCount.get(product.categoryId) ?? 0;
      perCategoryCount.set(product.categoryId, index + 1);

      const id = productId(product.categoryId, index);
      seededProductIds.push(id);

      const scalars = {
        categoryId: product.categoryId,
        title: product.title,
        imageSrc: product.imageSrc,
        ingredients: product.ingredients,
        price: product.price,
      };

      await prisma.product.upsert({
        where: { id },
        create: { id, ...scalars },
        update: scalars,
      });

      await prisma.nutrition.upsert({
        where: { productId: id },
        create: {
          id: `${id}:nutrition`,
          productId: id,
          caloriesPer100g: product.nutrition.caloriesPer100g,
        },
        update: { caloriesPer100g: product.nutrition.caloriesPer100g },
      });

      for (const option of product.options) {
        const optId = optionId(id, option.key);

        await prisma.productOption.upsert({
          where: { id: optId },
          create: {
            id: optId,
            productId: id,
            title: option.title,
            type: option.type,
            required: option.required ?? false,
          },
          update: {
            title: option.title,
            type: option.type,
            required: option.required ?? false,
          },
        });

        for (const value of option.values) {
          const valueId = optionValueId(optId, value.slug);
          const valueScalars = {
            slug: value.slug,
            title: value.title,
            price: value.price ?? null,
            weight: value.weight ?? null,
          };

          await prisma.productOptionValue.upsert({
            where: { id: valueId },
            create: { id: valueId, optionId: optId, ...valueScalars },
            update: valueScalars,
          });
        }
      }
    }

    // Products dropped from the seed should not linger in the database.
    const removed = await prisma.product.deleteMany({
      where: { id: { notIn: seededProductIds } },
    });

    console.log(
      `Seeded ${seededProductIds.length} products` +
        (removed.count > 0 ? `, removed ${removed.count} stale` : ''),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
