import { ComponentPropsWithRef, FC, ReactNode } from 'react';
import { ButtonSize } from '../types';
import { getClasses } from './styles/get-classes';

type CustomIconButtonProps = {
  icon: ReactNode;
  size?: ButtonSize;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

type IconButtonProps = CustomIconButtonProps & ComponentPropsWithRef<'button'>;

export const IconButton: FC<IconButtonProps> = ({
  icon,
  size = 'medium',
  onClick,
  className,
  style,
  disabled,
  ...props
}) => {
  const { cnRoot, cnIcon } = getClasses({
    size,
    className,
    disabled,
  });
  return (
    <button className={cnRoot} onClick={onClick} disabled={disabled} {...props}>
      <span className={cnIcon}>{icon}</span>
    </button>
  );
};
