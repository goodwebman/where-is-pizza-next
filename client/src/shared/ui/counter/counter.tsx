'use client'
import { getCounterClasses } from './styles/get-classes';

type CounterProps = {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'small' | 'medium' | 'large';
};

export const Counter = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 'medium',
}: CounterProps) => {

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
      size,
      disabledDecrement: value <= min,
      disabledIncrement: value >= max,
    });

  return (
    <div className={cnRoot}>
      <button type="button" className={cnButtonDecrement} onClick={handleDecrement}>
        -
      </button>

      <span className={cnValue}>{value}</span>

      <button type="button" className={cnButtonIncrement} onClick={handleIncrement}>
        +
      </button>
    </div>
  );
};

Counter.displayName = 'Counter';