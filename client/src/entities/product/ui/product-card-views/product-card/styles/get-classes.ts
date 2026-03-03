import classNames from 'classnames/bind';
import classes from './product-card.module.scss';

const cn = classNames.bind(classes);

type CardArgs = {
  badge?: 'new' | 'popular';
  className?: string;
  forSlider?: boolean;
};

export const getProductCardClasses = ({
  badge,
  className,
  forSlider,
}: CardArgs) => {
  const cnCard = cn('card', { 'for-slider': forSlider }, className);
  const cnImageWrapper = cn('imageWrapper', { 'for-slider': forSlider });
  const cnImage = cn('image');
  const cnContent = cn('content');
  const cnTitle = cn('title', { 'for-slider': forSlider });
  const cnIngredients = cn('ingredients', { 'for-slider': forSlider });
  const cnFooter = cn('footer');
  const cnDesktopFooter = cn('desktop-footer', { 'for-slider': forSlider });
  const cnMobileFooter = cn('mobile-footer', { 'for-slider': forSlider });
  const cnButton = cn('button');
  const cnPrice = cn('price', { 'for-slider': forSlider });

  const cnBadge = cn('badge', {
    new: badge === 'new',
    popular: badge === 'popular',
  });

  return {
    cnCard,
    cnImageWrapper,
    cnImage,
    cnContent,
    cnTitle,
    cnIngredients,
    cnFooter,
    cnButton,
    cnPrice,
    cnBadge,
    cnDesktopFooter,
    cnMobileFooter,
  };
};
