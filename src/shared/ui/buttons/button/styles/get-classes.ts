import classNames from 'classnames/bind';
import { SPINNER_COLORS } from '../../../spinner/types';
import classes from './button.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  size?: string;
  variant?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
};

export const getClasses = ({
  className,
  size,
  variant,
  isLoading,
  fullWidth,
}: Args) => {
  const cnRoot = cn(
    'button',
    size,
    variant,
    { fullWidth, loading: isLoading },
    className,
  );
  const cnTitle = cn('title');
  const cnLoading = cn('loading');
  const cnSpinnerWrapper = cn('spinner');

  const spinnerColor =
    variant && SPINNER_COLORS[variant as keyof typeof SPINNER_COLORS];
  const cnLeftIcon = cn('icon', 'left');
  const cnRightIcon = cn('icon', 'right');

  return {
    cnRoot,
    cnTitle,
    cnLeftIcon,
    cnRightIcon,
    cnLoading,
    spinnerColor,
    cnSpinnerWrapper,
  };
};
