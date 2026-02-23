import { Buttons } from '@/src/shared/ui';
import Image from 'next/image';
import React from 'react';
import { Product } from '../../model/types';
import { getProductCardClasses } from './styles/get-classes';

type ProductCardProps = {
  className?: string;
  onSelect?: () => void;
} & Product;

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  imageSrc,
  ingredients,
  price,
  badge,
  className,
  onSelect,
}) => {
  const {
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
  } = getProductCardClasses({ badge, className });

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

        <p className={cnIngredients}>
          {(Array.isArray(ingredients)
            ? ingredients
            : JSON.parse(ingredients)
          ).join(', ')}
        </p>

        <div className={cnFooter}>
          <Buttons.DefaultButton onClick={onSelect}>
            Выбрать
          </Buttons.DefaultButton>

          <span className={cnPrice}>от {price} ₽</span>
        </div>
      </div>
    </article>
  );
};
