import classNames from 'classnames/bind';

import classes from './header-logo.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn(
    'root',
    className,
  );

  const cnText = cn('logo-text')

  return {
    cnRoot,
    cnText
  };
};
