import { parseIngredientsToString } from '@/src/shared/lib/helpers/formaters/ingredients';
import { WithClassNames } from '@/src/shared/types';
import { Buttons } from '@/src/shared/ui';
import Image from 'next/image';
import React from 'react';
import { Product } from '../../../model/types';
import { getProductCardClasses } from './styles/get-classes';

type ProductCardProps = {
  onClick?: () => void;
  forSlider?: boolean;
} & Product;

export const ProductCard: React.FC<WithClassNames<ProductCardProps>> = ({
  title,
  imageSrc,
  ingredients,
  price,
  badge,
  className,
  onClick,
  forSlider,
}) => {
  const {
    cnCard,
    cnImageWrapper,
    cnImage,
    cnContent,
    cnTitle,
    cnIngredients,
    cnFooter,
    cnPrice,
    cnBadge,
    cnDesktopFooter,
    cnMobileFooter,
  } = getProductCardClasses({ badge, className, forSlider });

  return (
    <article className={cnCard}>
      <div className={cnImageWrapper}>
        {badge && (
          <span className={cnBadge}>{badge === 'new' ? 'NEW' : 'POPULAR'}</span>
        )}

        <Image
          src={imageSrc}
          alt={title}
          fill
          className={cnImage}
          priority={false}
        />
      </div>

      <div className={cnContent}>
        <h3 className={cnTitle}>{title}</h3>

        <p className={cnIngredients}>{parseIngredientsToString(ingredients)}</p>

        <div className={cnFooter}>
          <div className={cnDesktopFooter}>
            <Buttons.DefaultButton onClick={onClick}>
              Выбрать
            </Buttons.DefaultButton>
            <span className={cnPrice}>от {price} ₽</span>
          </div>

          <div className={cnMobileFooter}>
            <Buttons.DefaultButton onClick={onClick}>
              от {price} ₽
            </Buttons.DefaultButton>
          </div>
        </div>
      </div>
    </article>
  );
};
