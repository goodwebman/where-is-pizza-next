import { Icons } from '../../../shared/assets/svg/components';
import { IngredientIcon } from './types';

export const ingredientIcons: Record<string, IngredientIcon> = {
  cheese: Icons.Cheese,
  champignons: Icons.Champignons,
  red_onion: Icons.RedOnion,
  sweet_papper: Icons.SweetPapper,
  pepperoni: Icons.Pepperoni,
  tomato_sauce: Icons.TomatoSauce,
  carrot: Icons.Carrot,
  cherry: Icons.Cherry,
  garlic: Icons.Garlic,
  orange: Icons.Orange,
  meat: Icons.Steak,
  milk: Icons.Milk,
  strawberry: Icons.Strawberry,
  sausage: Icons.Sausage,
  rice_bowl: Icons.RiceBowl,
  prawn: Icons.Prawn,
  eggplant: Icons.Eggplant,
  chicken: Icons.Chicken,
};

export function getIngredientIcon(id: string): IngredientIcon {
  return ingredientIcons[id];
}
