import classNames from 'classnames/bind';

import classes from './header-container.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnHeader = cn('header', className);
  const cnDivider = cn('divider');

  return {
    cnHeader,
    cnDivider,
  };
};
