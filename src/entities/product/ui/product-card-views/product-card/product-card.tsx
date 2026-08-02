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
    cnAction,
    cnPrice,
    cnBadge,
  } = getProductCardClasses({ badge, className, forSlider });

  const ingredientsLabel = parseIngredientsToString(ingredients);

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
          // Without `sizes` a fill image always downloads the largest source,
          // and these cards are 260px wide at most.
          sizes="(max-width: 520px) 45vw, (max-width: 1024px) 40vw, 300px"
          className={cnImage}
          priority={false}
        />
      </div>

      <div className={cnContent}>
        <h3 className={cnTitle}>{title}</h3>

        {ingredientsLabel && (
          <p className={cnIngredients}>{ingredientsLabel}</p>
        )}

        <div className={cnFooter}>
          {/*
            Price before the button in the DOM: it reads as "от 220 ₽ - Выбрать"
            for screen readers, and lets the button take the remaining width
            instead of pushing the price out of the card.
          */}
          <span className={cnPrice}>от {price} ₽</span>

          <Buttons.DefaultButton
            className={cnAction}
            onClick={onClick}
            aria-label={`Выбрать: ${title}`}
          >
            Выбрать
          </Buttons.DefaultButton>
        </div>
      </div>
    </article>
  );
};
