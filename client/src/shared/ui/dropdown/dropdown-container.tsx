import { useClickOutside } from '@/src/shared/hooks/ui';
import {
  FC,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const { cnContainer, cnMenu, cnLabel } = getDropdownClasses(
    className,
    labelClassName,
  );
  const { cnButton, cnArrowIcon } = getDropdownButtonClasses({ isOpen });

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleItemClick = useCallback(
    (value: string, href?: string) => {
      onSelect(value, href);
      setIsOpen(false);
    },
    [onSelect],
  );

  const handleClickOutside = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRef, handleClickOutside);

  const selectedOptionLabel = selectedValue
    ? options.find(option => option.value === selectedValue)?.children
    : null;
  const displayLabel = selectedOptionLabel || placeholder;

  useLayoutEffect(() => {
    if (isOpen && dropdownRef.current && menuRef.current) {
      const buttonRect = dropdownRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top = buttonRect.bottom + 4;
      let left = buttonRect.left;

      if (buttonRect.bottom + menuRect.height > viewportHeight) {
        top = buttonRect.top - menuRect.height - 4;
      }

      if (buttonRect.left + menuRect.width > viewportWidth) {
        left = viewportWidth - menuRect.width - 4;
      }

      if (left < 4) left = 4;

      setMenuStyles({ top, left });
    }
  }, [isOpen]);

  return (
    <div className={cnContainer} ref={dropdownRef}>
      <button type="button" className={cnButton} onClick={handleToggle}>
        <span className={cnLabel}>{displayLabel}</span>
        <div className={cnArrowIcon}>
          <Icons.ArrowDown width={12} height={12} className={cnArrowIcon} />
        </div>
      </button>

      {isOpen && (
        <ul
          role="menu"
          ref={menuRef}
          className={cnMenu}
          style={{
            top: menuStyles.top,
            left: menuStyles.left,
          }}
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
