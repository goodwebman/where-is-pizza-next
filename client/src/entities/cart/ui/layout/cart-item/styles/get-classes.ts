import classNames from 'classnames/bind';
import classes from './cart-item.module.scss';

const cn = classNames.bind(classes);

export const getCartItemClasses = ({
  className,
  mode,
}: {
  className?: string;
  mode?: 'drawer' | 'default';
}) => ({
  cnContainer: cn(
    'container',
    mode === 'drawer' ? 'drawer' : 'default',
    className,
  ),
  cnLeftBlock: cn('leftBlock'),
  cnRightBlock: cn('rightBlock'),
  cnImage: cn('image'),
  cnLabel: cn('label'),
  cnOptions: cn('options'),
  cnPrice: cn('price'),
  cnQuantityWithPrice: cn('quantity--with--price')
});
