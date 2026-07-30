import { FC } from 'react';
import { getTagButtonClasses } from './styles/get-classse';

type TagButtonProps = {
  label: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
};

export const TagButton: FC<TagButtonProps> = ({
  label,
  selected,
  onClick,
  className,
}) => {
  const { cnButton } = getTagButtonClasses({ selected, className });

  return (
    <button type="button" className={cnButton} onClick={onClick}>
      {label}
    </button>
  );
};

TagButton.displayName = 'TagButton';
