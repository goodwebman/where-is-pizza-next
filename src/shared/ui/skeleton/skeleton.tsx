import { ComponentPropsWithoutRef, FC } from 'react';

import { getClasses } from './styles/get-classes';

type RootComponentProps = ComponentPropsWithoutRef<'span'>;

enum Variant {
  PILL = 'pill',
  SUPERELLIPSE = 'superellipse',
  CIRCLE = 'circle',
  SQUARE = 'square',
}

export interface SkeletonProps extends RootComponentProps {
  variant?: Lowercase<keyof typeof Variant>;
  isLoading?: boolean;
}

export const Skeleton: FC<SkeletonProps> = ({
  className,
  variant = Variant.PILL,
  isLoading = true,
  children,
  ...props
}) => {
  const { cnRoot, cnInner } = getClasses({ className, variant });

  if (!isLoading) {
    return <>{children} </>;
  }

  return (
    <span className={cnRoot} {...props}>
      <span className={cnInner}>{children}</span>
    </span>
  );
};