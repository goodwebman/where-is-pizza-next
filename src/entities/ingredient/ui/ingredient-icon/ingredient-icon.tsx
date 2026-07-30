import { Icons } from '@/src/shared/assets/svg/components';
import { ingredientIcons } from '../../model/ingredients';

export const IngredientIcon = ({ id }: { id: string }) => {
  const Icon = ingredientIcons[id] ?? Icons.Cheese;

  return <Icon color="var(--icon-secondary)" width={40} height={40} />;
};
