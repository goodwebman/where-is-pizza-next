import { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';

import { Icons } from '../../assets/svg/components';
import { DropdownItem } from './dropdown-item';
import {
  getDropdownButtonClasses,
  getDropdownClasses,
} from './styles/get-classes';

type DropdownOption = {
  children: ReactNode;
  value: string;
  isActive?: boolean;
  className?: string;
  href?: string;
};

type DropdownContainerProps = {
  placeholder?: string;
  options: DropdownOption[];
  onSelect: (value: string, href?: string) => void;
  selectedValue?: string;
  className?: string;
  labelClassName?: string;
  forNavigate?: boolean;
};

export const DropdownContainer: FC<DropdownContainerProps> = ({
  placeholder = 'Выберите',
  options,
  onSelect,
  selectedValue,
  className,
  labelClassName,
  forNavigate = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { cnContainer, cnMenu, cnLabel } = getDropdownClasses(
    className,
    labelClassName,
  );

  const { cnButton, cnArrowIcon } = getDropdownButtonClasses({ isOpen });

  // 🔥 Floating logic
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [
      offset(8),
      flip(), 
      shift({ padding: 24 }),
    ],
    whileElementsMounted: autoUpdate,
  });


  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    role,
  ]);

  const handleItemClick = useCallback(
    (value: string, href?: string) => {
      onSelect(value, href);
      setIsOpen(false);
    },
    [onSelect],
  );

  const selectedOptionLabel = useMemo(
    () =>
      selectedValue
        ? options.find(option => option.value === selectedValue)?.children
        : null,
    [selectedValue, options],
  );

  const displayLabel = selectedOptionLabel || placeholder;

  return (
    <div className={cnContainer}>
      <button
        ref={refs.setReference}
        type="button"
        className={cnButton}
        {...getReferenceProps({
          onClick: () => setIsOpen(prev => !prev),
        })}
      >
        <span className={cnLabel}>{displayLabel}</span>
        <div className={cnArrowIcon}>
          <Icons.ArrowDown width={12} height={12} />
        </div>
      </button>

      {isOpen && (
        <ul
          ref={refs.setFloating}
          style={floatingStyles}
          className={cnMenu}
          {...getFloatingProps()}
        >
          {options.map(option => (
            <DropdownItem
              key={option.value}
              value={option.value}
              onItemClick={handleItemClick}
              isActive={option.value === selectedValue}
              className={option.className}
              href={forNavigate && option.href ? option.href : undefined}
            >
              {option.children}
            </DropdownItem>
          ))}
        </ul>
      )}
    </div>
  );
};

DropdownContainer.displayName = 'DropdownContainer';
