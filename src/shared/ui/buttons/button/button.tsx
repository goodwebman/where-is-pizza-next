import { ComponentPropsWithRef, FC, ReactNode } from 'react';
import { Spinner } from '../../spinner/spinner';
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

export const DefaultButton: FC<ButtonProps> = ({
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

  const {
    cnRoot,
    cnTitle,
    cnLeftIcon,
    cnRightIcon,
    cnSpinnerWrapper,
    spinnerColor,
  } = getClasses({
    className,
    size,
    variant,
    fullWidth,
    isLoading,
  });

  return (
    <button
      className={cnRoot}
      aria-busy={isLoading}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <span className={cnSpinnerWrapper}>
          <Spinner size={size} color={spinnerColor} />
        </span>
      )}
      {leftIcon && !isLoading && <span className={cnLeftIcon}>{leftIcon}</span>}
      <span className={cnTitle}>{children}</span>
      {rightIcon && !isLoading && (
        <span className={cnRightIcon}>{rightIcon}</span>
      )}
    </button>
  );
};
