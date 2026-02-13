import classNames from 'classnames/bind';

import classes from './top-info-desktop.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn('root', className);

  const cnInfo = cn('info');

  const cnLeftSide = cn('left-side');
  const cnDropdownWrapper = cn('dropdown-wrapper');
  const cnDeliveryTime = cn('delivery-time');
  const cnDropdown = cn('dropdown');
  const cnDropdownLabel = cn('dropdown-label');

  return {
    cnRoot,
    cnInfo,
    cnLeftSide,
    cnDropdownWrapper,
    cnDeliveryTime,
    cnDropdown,
    cnDropdownLabel,
  };
};
