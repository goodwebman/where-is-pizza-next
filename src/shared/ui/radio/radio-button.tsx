import { FC } from 'react';
import { getRadioButtonClasses } from './styles/get-classes';

type RadioButtonProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
};

export const RadioButton: FC<RadioButtonProps> = ({
  label,
  checked,
  onChange,
  className,
}) => {
  const { cnButton, cnCircle, cnLabel } = getRadioButtonClasses({
    checked,
    className,
  });

  return (
    <label className={cnButton} onClick={onChange}>
      <span className={cnCircle} />
      <span className={cnLabel}>{label}</span>
    </label>
  );
};

RadioButton.displayName = 'RadioButton';
