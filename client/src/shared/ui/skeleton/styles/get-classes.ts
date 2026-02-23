import classNames from 'classnames/bind';

import { SkeletonProps } from '../skeleton';
import classes from './skeleton.module.scss';

const cn = classNames.bind(classes);

type ClassesArgs = Pick<SkeletonProps, 'className' | 'variant'>;

export const getClasses = ({ className, variant }: ClassesArgs) => {
  const cnRoot = cn('skeleton', `skeleton--${variant}`, className);

  const cnInner = cn('skeleton__inner');

  return {
    cnRoot,
    cnInner,
  };
};