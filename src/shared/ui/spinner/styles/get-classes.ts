import classNames from 'classnames/bind';
import classes from './spinner.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  size?: 'small' | 'medium' | 'large';
};

export const getClasses = ({ className, size = 'medium' }: Args) => {
  const cnRoot = cn('spinner', size, className);

  return { cnRoot };
};
