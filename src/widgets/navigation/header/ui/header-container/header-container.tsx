'use client'
import { Divider } from '@/src/shared/ui';
import { FC, ReactElement } from 'react';
import { getClasses } from './styles/get-classes';

type HeaderContainerProps = {
  className?: string;
  topSlot?: ReactElement;
  bottomSlot?: ReactElement;
};

export const HeaderContainer: FC<HeaderContainerProps> = ({
  className,
  topSlot,
  bottomSlot,
}) => {
  const { cnHeader } = getClasses({ className });
  return (
    <header className={cnHeader}>
      <section>{topSlot}</section>
      <Divider />
      <section> {bottomSlot}</section>
      <Divider />
    </header>
  );
};

HeaderContainer.displayName = 'HeaderContainer';
