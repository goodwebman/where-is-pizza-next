import classNames from 'classnames/bind';
import styles from './order-pagination.module.scss';

const cn = classNames.bind(styles);

type ButtonParams = {
  active?: boolean;
  disabled?: boolean;
  arrow?: boolean;
  arrowActive?: boolean;
};

export const getClasses = () => {
  const cnContainer = cn('container');

  const cnButton = ({
    active,
    disabled,
    arrow,
    arrowActive,
  }: ButtonParams = {}) =>
    cn('button', {
      active,
      disabled,
      arrow,
      arrowActive,
    });

  const cnDots = cn('dots');

  return {
    cnContainer,
    cnButton,
    cnDots,
  };
};