import classNames from 'classnames/bind';

import classes from './user-info.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({
  className,

}: Args) => {
    const cnRoot = cn('button', className)
    const cnText = cn('text')
  return {
    cnRoot,
    cnText
  };
};
