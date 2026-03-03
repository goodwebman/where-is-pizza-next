import { ComponentPropsWithRef, FC, ReactNode } from 'react';
import { ButtonSize } from '../types';
import { getClasses } from './styles/get-classes';

type CustomIconButtonProps = {
  icon: ReactNode;
  size?: ButtonSize;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  circle?: boolean;
};

type IconButtonProps = CustomIconButtonProps & ComponentPropsWithRef<'button'>;

export const IconButton: FC<IconButtonProps> = ({
  icon,
  size = 'medium',
  onClick,
  className,
  style,
  disabled,
  circle,
  type = 'button',
  ...props
}) => {
  const { cnRoot, cnIcon } = getClasses({
    size,
    className,
    disabled,
    circle,
  });
  return (
    <button
      {...props}
      type={type}
      className={cnRoot}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={cnIcon}>{icon}</span>
    </button>
  );
};

IconButton.displayName = 'IconButton';
