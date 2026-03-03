import classNames from 'classnames/bind';
import classes from './order-form.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn('root', className);

  return {
    cnRoot,
  };
};
