'use client'
import { FC, useRef, useState, useCallback, ReactNode } from 'react'; // Добавил ReactNode
import { DropdownItem, DropdownItemProps } from './dropdown-item';
import { useClickOutside } from '@/src/shared/hooks/ui';
import { Icons } from '../../assets/svg/components'; 
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { cnContainer, cnMenu, cnLabel,  } = getDropdownClasses(className, labelClassName);
  const { cnButton, cnArrowIcon } = getDropdownButtonClasses({ isOpen });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

 
  const handleItemClick = useCallback((value: string, href?: string) => {
    onSelect(value, href);
    setIsOpen(false);
 
  }, [onSelect]);

  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(dropdownRef, handleClickOutside);

  const selectedOptionLabel = selectedValue
    ? options.find(option => option.value === selectedValue)?.children
    : null;

 
  const displayLabel = selectedOptionLabel || placeholder;

  return (
    <div className={cnContainer} ref={dropdownRef}>
      <button type="button" className={cnButton} onClick={handleToggle}>
        <span className={cnLabel}>{displayLabel}</span>
 
       <div className={cnArrowIcon}>
         <Icons.ArrowDown width={12} height={12} className={cnArrowIcon} />
       </div>
      </button>

      {isOpen && (
        <ul role="menu" className={cnMenu}> 
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
