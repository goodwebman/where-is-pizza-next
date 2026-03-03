import classNames from 'classnames/bind';
import classes from './order-delivery-time.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnSubmit = cn('submit', className);
  const cnSubmitPrice = cn('submit--price');

  return {
   cnSubmit,
   cnSubmitPrice
  };
};
