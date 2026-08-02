import classNames from 'classnames/bind';
import classes from './profile-orders-history.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnContainer = cn('container', className);
  const cnSkeleton = cn('skeleton');
  const cnLink = cn('link');

  return {
    cnContainer,
    cnSkeleton,
    cnLink,
  };
};
