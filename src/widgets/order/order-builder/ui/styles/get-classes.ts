import classNames from 'classnames/bind';
import classes from './order-builder.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnContainer = cn('container', className);
  const cnLabelExtra = cn('labelExtra')
  return {
    cnContainer,
    cnLabelExtra
  };
};
