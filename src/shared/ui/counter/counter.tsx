'use client';
import { FC } from 'react';
import { WithClassNames } from '../../types';
import { getCounterClasses } from './styles/get-classes';

type CounterProps = {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export const Counter: FC<WithClassNames<CounterProps>> = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange?.(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange?.(newValue);
  };

  const { cnRoot, cnValue, cnButtonDecrement, cnButtonIncrement } =
    getCounterClasses({
      className,
      disabledDecrement: value <= min,
      disabledIncrement: value >= max,
    });

  return (
    <div className={cnRoot}>
      <button
        type="button"
        className={cnButtonDecrement}
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Уменьшить"
      >
        -
      </button>

      <span className={cnValue} aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        className={cnButtonIncrement}
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Увеличить"
      >
        +
      </button>
    </div>
  );
};

Counter.displayName = 'Counter';
