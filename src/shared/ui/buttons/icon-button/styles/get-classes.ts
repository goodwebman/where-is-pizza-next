import classNames from 'classnames/bind';
import type { ButtonSize } from '../../types';
import classes from './icon-button.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  size?: ButtonSize;
  disabled?: boolean;
 
};

export const getClasses = ({ className, size = 'medium', disabled }: Args) => {
  const cnRoot = cn('button', size, { disabled }, className);
  const cnIcon = cn('icon');
 

  return {
    cnRoot,
    cnIcon,
  };
};
