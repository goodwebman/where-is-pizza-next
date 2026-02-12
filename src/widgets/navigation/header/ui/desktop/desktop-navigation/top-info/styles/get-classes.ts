import classNames from 'classnames/bind';

import classes from './top-info.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn(
    'root',
    className,
  );

  const cnInfo = cn('info')
  const cnWrapper = cn('wrapper')
 const cnLeftSide = cn('left-side')
 const cnDropdownWrapper = cn('dropdown-wrapper')

  return {
    cnRoot,
    cnInfo,
    cnWrapper,
    cnLeftSide,
    cnDropdownWrapper
   
  };
};
