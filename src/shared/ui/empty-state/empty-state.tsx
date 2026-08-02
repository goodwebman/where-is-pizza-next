'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FC, ReactNode } from 'react';
import { getClasses } from './styles/get-classes';

type EmptyStateProps = {
  /** Illustration, icon or anything visual. Kept as a slot so the caller owns
   *  sizing and image loading instead of this component guessing. */
  media?: ReactNode;
  title: string;
  description?: ReactNode;
  /** Buttons or links — rendered under the text. */
  action?: ReactNode;
  /** Inline block inside an existing card/section rather than a full page. */
  compact?: boolean;
  className?: string;
};

export const EmptyState: FC<EmptyStateProps> = ({
  media,
  title,
  description,
  action,
  compact,
  className,
}) => {
  const { cnRoot, cnMedia, cnTitle, cnDescription, cnAction } = getClasses({
    className,
    compact,
  });

  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cnRoot}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {media && <div className={cnMedia}>{media}</div>}

      <p className={cnTitle}>{title}</p>

      {description && <p className={cnDescription}>{description}</p>}

      {action && <div className={cnAction}>{action}</div>}
    </motion.div>
  );
};

EmptyState.displayName = 'EmptyState';
