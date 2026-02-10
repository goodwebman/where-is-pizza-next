import classNames from 'classnames/bind';
import classes from './counter.module.scss';

const cn = classNames.bind(classes);

type CounterClassesArgs = {
  size?: 'small' | 'medium' | 'large';
  disabledDecrement?: boolean;
  disabledIncrement?: boolean;
};

export const getCounterClasses = ({
  size = 'medium',
  disabledDecrement,
  disabledIncrement,
}: CounterClassesArgs = {}) => {
  const cnRoot = cn('counter', size);
  const cnButton = cn('button');
  const cnValue = cn('value');

  const cnButtonDecrement = cn('button', { disabled: disabledDecrement });
  const cnButtonIncrement = cn('button', { disabled: disabledIncrement });

  return {
    cnRoot,
    cnButton,
    cnValue,
    cnButtonDecrement,
    cnButtonIncrement,
  };
};
