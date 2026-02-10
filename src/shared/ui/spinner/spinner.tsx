'use client';

import { type FC } from 'react';
import { Icons } from '../../assets/svg/components';
import { getClasses } from './styles/get-classes';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ size = 'small', className, color }) => {
  const { cnRoot } = getClasses({ size, className });

  return (
    <div className={cnRoot}>
      <Icons.Spinner color={color}/>
    </div>
  );
};

Spinner.displayName = 'Spinner'