import classNames from 'classnames/bind';
import classes from './dropdown.module.scss';

const cn = classNames.bind(classes);

type DropdownButtonArgs = {
  isOpen?: boolean;
  className?: string;
};

type DropdownItemArgs = {
  isActive?: boolean;
  className?: string;
};

export const getDropdownClasses = (
  className?: string,
  labelClassName?: string,
) => ({
  cnContainer: cn('container', className),
  cnMenu: cn('menu'),
  cnLabel: cn('label', labelClassName),
});

export const getDropdownButtonClasses = ({
  isOpen,
  className,
}: DropdownButtonArgs) => ({
  cnButton: cn('button', { open: isOpen }, className),
  cnArrowIcon: cn('arrow-icon', { open: isOpen }),
});

export const getDropdownItemClasses = ({
  isActive,
  className,
}: DropdownItemArgs) => ({
  cnItem: cn('item', { active: isActive }, className),
});
