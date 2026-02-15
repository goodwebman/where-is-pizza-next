import classNames from 'classnames/bind';

import classes from './divider.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  
  const cnDivider = cn('divider', className);

  return {
    cnDivider,
  };
};
