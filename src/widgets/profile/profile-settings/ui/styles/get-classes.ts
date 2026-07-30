import classNames from 'classnames/bind';
import classes from './profile-settings.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnContainer = cn('container', className);
  return {
    cnContainer,
  };
};
