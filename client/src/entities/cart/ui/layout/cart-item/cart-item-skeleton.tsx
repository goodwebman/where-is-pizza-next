import { Skeleton } from '@/src/shared/ui/skeleton/skeleton';
import { getCartItemClasses } from './styles/get-classes';

export const CartItemSkeleton = () => {
  const {
    cnContainer,
    cnLeftBlock,
    cnRightBlock,
    cnImage,
    cnLabel,
    cnPrice,
    cnOptions,
    cnQuantityWithPrice,
  } = getCartItemClasses({});
  return (
    <div className={cnContainer}>
      <div className={cnContainer}>
        <div className={cnLeftBlock}>
          <Skeleton className={cnImage} />
        </div>
        <div className={cnRightBlock}>
          <Skeleton className={cnLabel} />

          <Skeleton className={cnOptions} />

          <div className={cnQuantityWithPrice}>
            <Skeleton />
            <Skeleton className={cnPrice} />
          </div>
        </div>
      </div>
    </div>
  );
};
