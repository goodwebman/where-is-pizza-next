'use client';

import { parseIngredientsToString } from '@/src/shared/lib/helpers/formaters/ingredients';
import { WithClassNames } from '@/src/shared/types';
import { Buttons } from '@/src/shared/ui';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { Product } from '../../../model/types';
import { getProductCardClasses } from './styles/get-classes';

type ProductCardProps = {
  onClick?: () => void;
  forSlider?: boolean;
  /** Position in its row — drives the entrance stagger. */
  index?: number;
};

/** Enough to read as a wave, capped so late cards do not sit blank for a second. */
const STAGGER_STEP = 0.06;
const MAX_STAGGER = 0.36;

export const ProductCard: React.FC<
  WithClassNames<ProductCardProps & Product>
> = ({
  title,
  imageSrc,
  ingredients,
  price,
  badge,
  className,
  onClick,
  forSlider,
  index = 0,
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

  const prefersReducedMotion = useReducedMotion();

  const ingredientsLabel = parseIngredientsToString(ingredients);

  return (
    <motion.article
      className={cnCard}
      // whileInView rather than a mount animation: the catalogue renders every
      // category at once, so a mount animation would fire for cards far below
      // the fold and be over before anyone scrolled to them.
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * STAGGER_STEP, MAX_STAGGER),
      }}
    >
      <div className={cnImageWrapper}>
        {badge && (
          <span className={cnBadge}>{badge === 'new' ? 'NEW' : 'POPULAR'}</span>
        )}

        <Image
          src={imageSrc}
          alt={title}
          fill
          // Without `sizes` a fill image always downloads the largest source,
          // and these cards are 300px wide at most.
          sizes="(max-width: 520px) 45vw, (max-width: 1024px) 40vw, 300px"
          className={cnImage}
          priority={false}
        />
      </div>

      <div className={cnContent}>
        <h3 className={cnTitle}>{title}</h3>

        {ingredientsLabel && <p className={cnIngredients}>{ingredientsLabel}</p>}

        <div className={cnFooter}>
          {/*
            Price before the button in the DOM: it reads as "от 220 ₽ — Выбрать"
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
    </motion.article>
  );
};
