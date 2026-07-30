import classNames from 'classnames/bind';
import classes from './counter.module.scss';

const cn = classNames.bind(classes);

type CounterClassesArgs = {
  className?: string;
  disabledDecrement?: boolean;
  disabledIncrement?: boolean;
};

export const getCounterClasses = ({
  className,
  disabledDecrement,
  disabledIncrement,
}: CounterClassesArgs = {}) => {
  const cnRoot = cn('counter', className);
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
