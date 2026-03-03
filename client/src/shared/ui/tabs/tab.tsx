import { getClasses } from './styles/get-classes';

type TabProps<T extends string> = {
  label: string;
  value: T;
  isActive: boolean;
  disabled?: boolean;
  onClick: (value: T) => void;
};

export const Tab = <T extends string>({
  label,
  value,
  isActive,
  disabled,
  onClick,
}: TabProps<T>) => {
  const { cnTab } = getClasses({});

  return (
    <button
      className={cnTab({
        active: isActive,
        disabled,
      })}
      type="button"
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
