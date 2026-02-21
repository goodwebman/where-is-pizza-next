import Image from 'next/image';
import React from 'react';
import { getProductCardClasses } from './styles/get-classes';

type ProductCardProps = {
  title: string;
  imageSrc: string;
  ingredients: string[];
  price: number;
  badge?: 'new' | 'popular';
  className?: string;
  onSelect?: () => void;
};

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
          sizes="(max-width: 768px) 50vw, 280px"
          priority={false}
        />
      </div>

      <div className={cnContent}>
        <h3 className={cnTitle}>{title}</h3>

        <p className={cnIngredients}>{ingredients.join(', ')}</p>

        <div className={cnFooter}>
          <button className={cnButton} onClick={onSelect}>
            Выбрать
          </button>

          <span className={cnPrice}>от {price} ₽</span>
        </div>
      </div>
    </article>
  );
};
