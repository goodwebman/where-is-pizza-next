import classNames from 'classnames/bind';
import classes from './order-delivery-time.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRadioSection = cn('radio--section', className);
  const cnRadioWrapper = cn('radio--section--wrapper');
  const cnRadioRows = cn('radio--section--rows');
  const cnRadioSupLabel = cn('radio--section--supLabel');
  const cnRadioLabel = cn('radio--section--label');
  const cnRadioInput = cn('radio--section--input');

  return {
    cnRadioSection,
    cnRadioRows,
    cnRadioSupLabel,
    cnRadioLabel,
    cnRadioInput,
    cnRadioWrapper,
  };
};
