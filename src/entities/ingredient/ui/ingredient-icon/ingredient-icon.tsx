import { Icons } from '@/src/shared/assets/svg/components';
import { getIngredientIcon } from '../../model/ingredients';
export const IngredientIcon = ({ id }: { id: string }) => {
  const Icon = getIngredientIcon(id);

  if (!Icon) return <Icons.Cheese width={40} height={40} />;

  return <Icon color='var(--icon-secondary)' width={40} height={40} />;
};
