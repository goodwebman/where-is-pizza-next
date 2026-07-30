import classNames from 'classnames/bind';
import classes from './toaster.module.scss';

const cn = classNames.bind(classes);

export const getClasses = () => {
  return {
    cnRoot: cn('root'),
    cnSuccess: cn('success'),
    cnError: cn('error'),
    cnDefault: cn('default'),
  };
};