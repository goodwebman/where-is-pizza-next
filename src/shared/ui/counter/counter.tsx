import { useState } from 'react';
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
  const [internalValue, setInternalValue] = useState(value);

  const handleDecrement = () => {
    const newValue = Math.max(internalValue - step, min);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(internalValue + step, max);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const { cnRoot, cnValue, cnButtonDecrement, cnButtonIncrement } =
    getCounterClasses({
      size,
      disabledDecrement: internalValue <= min,
      disabledIncrement: internalValue >= max,
    });

  return (
    <div className={cnRoot}>
      <button
        type="button"
        className={cnButtonDecrement}
        onClick={handleDecrement}
      >
        -
      </button>
      <span className={cnValue}>{internalValue}</span>
      <button
        type="button"
        className={cnButtonIncrement}
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
};

Counter.displayName = 'Counter';
