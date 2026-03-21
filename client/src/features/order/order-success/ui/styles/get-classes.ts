import classNames from 'classnames/bind';
import classes from './order-success.module.scss';

const cn = classNames.bind(classes);

export const getClasses = ({ className }: { className?: string }) => ({
  cnRoot: cn('root', className),
  cnImage: cn('image'),
  cnTitle: cn('title'),
  cnSubtitle: cn('subtitle'),
  cnButton: cn('button'),
});