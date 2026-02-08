import { ComponentPropsWithRef, FC, ReactNode } from 'react';
import { ButtonSize, ButtonVariant } from '../types';
import { getClasses } from './styles/get-classes';

type CustomButtonProps = {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
};

type ButtonProps = CustomButtonProps & ComponentPropsWithRef<'button'>;

export const Button: FC<ButtonProps> = ({
  children,
  size = 'medium',
  variant = 'primary',
  leftIcon,
  rightIcon,
  isLoading,
  disabled,
  onClick,
  className,
  style,
  fullWidth = false,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const { cnRoot, cnTitle, cnLeftIcon, cnRightIcon } = getClasses({
    className,
    size,
    variant,
    fullWidth,
  });

  return (
    <button
      className={cnRoot}
      aria-busy={isLoading}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span>Loading</span>
      ) : (
        <>
          {leftIcon && <span className={cnLeftIcon}>{leftIcon}</span>}
          <span className={cnTitle}>{children}</span>
          {rightIcon && <span className={cnRightIcon}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
