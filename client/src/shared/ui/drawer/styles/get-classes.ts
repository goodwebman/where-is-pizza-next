import classNames from 'classnames/bind';
import classes from './drawer.module.scss';

const cn = classNames.bind(classes);

type DrawerArgs = {
  isOpen?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

type HeaderArgs = {
  className?: string;
};

type BackdropArgs = {
  isOpen?: boolean;
  className?: string;
};

export const getDrawerClasses = ({ isOpen, size = 'medium', className }: DrawerArgs) => ({
  cnDrawer: cn('drawer', size, { open: isOpen, closed: !isOpen }, className),
});

export const getDrawerHeaderClasses = ({ className }: HeaderArgs) => ({
  cnHeader: cn('header', className),
  cnCloseButton: cn('closeButton', className),
});

export const getDrawerBackdropClasses = ({ isOpen, className }: BackdropArgs) => ({
  cnBackdrop: cn('backdrop', { hidden: !isOpen }, className),
});