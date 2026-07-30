import classNames from 'classnames/bind';
import classes from './cart-drawer.module.scss';

const cn = classNames.bind(classes);

export const getClasses = ({ className }: { className?: string }) => ({
  cnRoot: cn('root', className),
  cnFooter: cn('footer'),
  cnRow: cn('row'),
  cnTotalLabel: cn('totalLabel'),
  cnTotalPrice: cn('totalPrice'),
  cnButton: cn('button'),
  cnEmptyCart: cn('empty-cart')
});
