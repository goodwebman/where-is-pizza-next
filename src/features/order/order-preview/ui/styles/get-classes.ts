import classNames from 'classnames/bind';
import classes from './order-preview.module.scss';

const cn = classNames.bind(classes);

export const getClasses = ({ className }: { className?: string }) => ({
  cnRoot: cn('root', className),
  cnLabel: cn('label'),
  cnTotalWrapper: cn('total--wrapper'),
  cnTotal: cn('total')
});
