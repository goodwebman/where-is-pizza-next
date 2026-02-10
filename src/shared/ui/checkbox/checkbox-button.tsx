import { FC } from 'react';
import { Icons } from '../../assets/svg/components';
import { getCheckboxButtonClasses } from './styles/get-classes';

type CheckboxButtonProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
};

export const CheckboxButton: FC<CheckboxButtonProps> = ({
  label,
  checked,
  onChange,
  className,
}) => {
  const { cnButton, cnBox, cnLabel, cnCheckIcon } = getCheckboxButtonClasses({
    checked,
    className,
  });

  return (
    <label className={cnButton} onClick={onChange}>
      <span className={cnBox}>
        {checked && (
          <Icons.Check color="var(--icon-primary)" className={cnCheckIcon} />
        )}
      </span>
      <span className={cnLabel}>{label}</span>
    </label>
  );
};


CheckboxButton.displayName = 'CheckboxButton'