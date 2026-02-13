import classNames from 'classnames/bind';

import classes from './footer-item.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnItem = cn('item', className);

  return {
    cnItem,
  };
};
