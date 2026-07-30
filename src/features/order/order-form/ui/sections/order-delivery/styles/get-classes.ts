import classNames from 'classnames/bind';
import classes from './order-delivery.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnDelivery = cn('delivery', className);
  const cnDeliveryLabel = cn('delivery--label');
  const cnDeliveryHeader = cn('delivery--header');
  const cnDeliveryInputs = cn('delivery--inputs');
    const cnDeliveryInputsWrapper = cn('delivery--inputs--wrapper');

  return {
    cnDelivery,
    cnDeliveryLabel,
    cnDeliveryHeader,
    cnDeliveryInputs,
    cnDeliveryInputsWrapper
  };
};
