'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '../../assets/svg/components';
import { getClasses } from './styles/get-classes';

type ModalProps = {
  className?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  const { cnRoot, cnOverlay, cnContent, cnCloseBtn } = getClasses({ className });

  if (!isOpen) return null;

  return createPortal(
    <div className={cnRoot}>
   
      <div className={cnOverlay} onClick={onClose} />

    
      <div className={cnContent}>{children}</div>

   
      <button className={cnCloseBtn} onClick={onClose}>
        <Icons.ModalXMark color="var(--icon-primary)" width={32} height={32} />
      </button>
    </div>,
    document.body
  );
};