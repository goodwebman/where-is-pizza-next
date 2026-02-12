import classNames from 'classnames/bind';

import classes from './cart-bade.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({
  className,

}: Args) => {
    const cnRoot = cn('button', className)
    const cnValue = cn('value')
    
  return {
    cnRoot,
    cnValue,
  
  };
};
