import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type Props = {
  open: boolean;
  onClick: () => void;
  className?: string;
};

export const BurgerButton: FC<Props> = ({
  open,
  onClick,
  className,
}) => {
  const { cnBurger } = getClasses({ open, className });

  return (
    <button
      className={cnBurger}
      onClick={onClick}
      aria-label="Open menu"
      aria-expanded={open}
    >
      <span />
      <span />
      <span />
    </button>
  );
};
