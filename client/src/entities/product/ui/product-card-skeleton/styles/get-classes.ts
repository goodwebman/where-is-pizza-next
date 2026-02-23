import classNames from 'classnames/bind';
import classes from './product-card-skeleton.module.scss';

const cn = classNames.bind(classes);

export const getProductCardSkeletonClasses = ({
  className,
}: {
  className?: string;
}) => {
  return {
    cnCard: cn('card', className),
    cnImageWrapper: cn('imageWrapper'),
    cnImageSkeleton: cn('imageSkeleton'),
    cnContent: cn('content'),
    cnTitle: cn('title'),
    cnIngredientsLine: cn('ingredientsLine'),
    cnFooter: cn('footer'),
    cnButton: cn('button'),
    cnPrice: cn('price'),
    cnIngredients: cn('ingredients')
  };
};
