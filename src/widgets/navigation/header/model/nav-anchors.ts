export const NAV_ANCHORS = {
  PROMOTIONS: 'promotions',
  PIZZA: 'pizza',
  SUSHI: 'sushi',
  DRINKS: 'drinks',
  SNACKS: 'snacks',
  COMBOS: 'combos',
  DESSERTS: 'desserts',
  SAUCES: 'sauces',
} as const;

export type NavAnchorKey = keyof typeof NAV_ANCHORS;
export type NavAnchorValue = (typeof NAV_ANCHORS)[NavAnchorKey];
export const getNavId = (anchor: NavAnchorValue) => `section-${anchor}`;

export const NAV_ITEMS: {
  label: string;
  anchor: NavAnchorValue;
}[] = [
  {
    label: 'Акции',
    anchor: NAV_ANCHORS.PROMOTIONS,
  },
  {
    label: 'Пицца',
    anchor: NAV_ANCHORS.PIZZA,
  },
  {
    label: 'Суши',
    anchor: NAV_ANCHORS.SUSHI,
  },
  {
    label: 'Напитки',
    anchor: NAV_ANCHORS.DRINKS,
  },
  { label: 'Закуски', anchor: NAV_ANCHORS.SNACKS },
  { label: 'Комбо', anchor: NAV_ANCHORS.COMBOS },
  {
    label: 'Десерты',
    anchor: NAV_ANCHORS.DESSERTS,
  },
  { label: 'Соусы', anchor: NAV_ANCHORS.SAUCES },
];
