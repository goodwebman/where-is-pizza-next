import classNames from 'classnames/bind';
import classes from './button.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  size?: string;
  variant?: string;
  fullWidth?: boolean;
};

export const getClasses = ({ className, size, variant, fullWidth }: Args) => {
  const cnRoot = cn('button', size, variant, { fullWidth }, className);
  const cnTitle = cn('title');

  const cnLeftIcon = cn('icon', 'left');
  const cnRightIcon = cn('icon', 'right');

  return {
    cnRoot,
    cnTitle,
    cnLeftIcon,
    cnRightIcon,
  };
};
