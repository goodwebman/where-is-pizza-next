import { FC } from 'react';

import { WithClassNames } from '@/src/shared/types';
import { Skeleton } from '@/src/shared/ui/skeleton/skeleton';
import { getProductCardSkeletonClasses } from './styles/get-classes';

export const ProductCardSkeleton: FC<WithClassNames> = ({ className }) => {
  const {
    cnCard,
    cnImageWrapper,
    cnImageSkeleton,
    cnContent,
    cnTitle,
    cnIngredientsLine,
    cnFooter,
    cnButton,
    cnPrice,
    cnIngredients,
  } = getProductCardSkeletonClasses({ className });

  return (
    <article className={cnCard}>
      <div className={cnImageWrapper}>
        <Skeleton className={cnImageSkeleton} />
      </div>

      <div className={cnContent}>
        <Skeleton className={cnTitle} />
        <div className={cnIngredients}>
          <Skeleton className={cnIngredientsLine} />
          <Skeleton className={cnIngredientsLine} />
        </div>

        <div className={cnFooter}>
          <Skeleton className={cnButton} />
          <Skeleton className={cnPrice} />
        </div>
      </div>
    </article>
  );
};
