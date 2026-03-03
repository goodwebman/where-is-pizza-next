import classNames from 'classnames/bind';
import classes from './cart-item.module.scss';

const cn = classNames.bind(classes);

export const getCartItemClasses = ({
  className,
  orderView = false,
}: {
  className?: string;
  orderView?: boolean;
}) => ({
  cnContainer: cn('container', className),
  cnLeftBlock: cn('leftBlock', { orderView }),
  cnRightBlock: cn('rightBlock', { orderView }), 
  cnRightBlockWrapper: cn('rightBlock--wrapper'),
  cnImage: cn('image'),
  cnLabel: cn('label'),
  cnCounter: cn('counter'),
  cnOptions: cn('options'),
  cnPrice: cn('price'),
  cnQuantityWithPrice: cn('quantity--with--price', { orderView }), 
});