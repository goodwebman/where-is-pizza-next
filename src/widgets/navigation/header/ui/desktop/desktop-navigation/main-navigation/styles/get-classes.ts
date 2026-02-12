import classNames from 'classnames/bind';
import classes from './main-navigation.module.scss';

const cn = classNames.bind(classes);

type ContainerArgs = {
  className?: string;
};

export const getContainerClasses = ({ className }: ContainerArgs) => {
  const cnRoot = cn('root', className);
  const cnContainer = cn('container');
  const cnLeft = cn('left');
  const cnCenter = cn('center');
  const cnRight = cn('right');

  return {
    cnRoot,
    cnContainer,
    cnLeft,
    cnCenter,
    cnRight,
  };
};

type ItemArgs = {
  className?: string;
  active?: boolean;
};

export const getItemClasses = ({ className, active }: ItemArgs) => {
  const cnItem = cn('item', { active }, className);
  const cnLink = cn('link');

  return {
    cnItem,
    cnLink,
  };
};
