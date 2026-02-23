'use client';

import { FC, ReactNode, useRef } from 'react';
import { Icons } from '../../assets/svg/components';
import { useClickOutside, useLockBodyScroll } from '../../hooks';
import {
  getDrawerBackdropClasses,
  getDrawerClasses,
  getDrawerHeaderClasses,
} from './styles/get-classes';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  label?: string;

  className?: string;
};

export const Drawer: FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  label,

  className,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(isOpen);

  useClickOutside(drawerRef, () => {
    if (isOpen) onClose();
  });

  const { cnDrawer } = getDrawerClasses({ isOpen, className });
  const { cnHeader, cnCloseButton } = getDrawerHeaderClasses({});
  const { cnBackdrop, cnContent } = getDrawerBackdropClasses({ isOpen });

  return (
    <>
      <div className={cnBackdrop} aria-hidden="true" />
      <aside
        ref={drawerRef}
        className={cnDrawer}
        role="dialog"
        aria-modal="true"
      >
        {label && (
          <div className={cnHeader}>
            <span>{label}</span>
            <button
              className={cnCloseButton}
              onClick={onClose}
              aria-label="Закрыть"
            >
              <Icons.BackDropXMark width={24} hanging={24} />
            </button>
          </div>
        )}
        <div className={cnContent}>{children}</div>
      </aside>
    </>
  );
};

Drawer.displayName = 'Drawer';
