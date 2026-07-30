import classNames from 'classnames/bind';
import classes from './cart-container.module.scss';

const cn = classNames.bind(classes);

export const getCartContainerClasses = ({
  className,
}: {
  className?: string;
}) => ({
  cnContainer: cn('container', className),
});
