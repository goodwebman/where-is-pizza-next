import React from 'react';
import { getContainerClasses } from './styles/get-classes';

type Props = {
  children: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
};

export function NavigationContainer({
  children,
  leftSlot,
  rightSlot,
  className,
}: Props) {
  const { cnRoot, cnContainer, cnLeft, cnCenter, cnRight } =
    getContainerClasses({ className });

  return (
    <nav className={cnRoot}>
      <div className={cnContainer}>
        {leftSlot && <div className={cnLeft}>{leftSlot}</div>}

        <ul className={cnCenter}>{children}</ul>

        {rightSlot && <div className={cnRight}>{rightSlot}</div>}
      </div>
    </nav>
  );
}
