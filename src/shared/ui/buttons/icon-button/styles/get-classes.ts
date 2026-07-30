import classNames from 'classnames/bind';
import type { ButtonSize } from '../../types';
import classes from './icon-button.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  size?: ButtonSize;
  disabled?: boolean;
  circle?: boolean;
 
};

export const getClasses = ({ className, size = 'medium', disabled, circle }: Args) => {
  const cnRoot = cn('button', size, { disabled }, className, {circle});
  const cnIcon = cn('icon');
 

  return {
    cnRoot,
    cnIcon,
  };
};
