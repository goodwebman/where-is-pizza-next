import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type DividerProps = {
  className?: string;
};

export const Divider: FC<DividerProps> = ({ className }) => {
  const { cnDivider } = getClasses({ className });
  return <div className={cnDivider} />;
};

Divider.displayName = 'Divider';
