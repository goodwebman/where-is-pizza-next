'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type FC,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '../../assets/svg/components';
import { useLockBodyScroll } from '../../hooks';
import { getClasses } from './styles/get-classes';

type ModalProps = {
  className?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const { cnRoot, cnOverlay, cnContent, cnCloseBtn } = getClasses({ className });

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useLockBodyScroll(isOpen);

  // Save and restore focus
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Focus the modal after a tick
      requestAnimationFrame(() => {
        modalRef.current?.focus();
      });
    }

    return () => {
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Escape closes the modal
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className={cnRoot}
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <div className={cnOverlay} onClick={onClose} aria-hidden="true" />

      <div
        ref={modalRef}
        className={cnContent}
        tabIndex={-1}
        role="document"
      >
        {/*
          Inside the dialog, not beside it: positioned against the full-screen
          container the button sat in the viewport corner, which on a short
          screen is above the vertically centred dialog - floating over the
          overlay instead of on the dialog itself.
        */}
        <button
          className={cnCloseBtn}
          onClick={onClose}
          aria-label="Закрыть"
          type="button"
        >
          {/*
            --icon-primary is gray-0, i.e. white: it was chosen back when this
            button sat on the dimmed overlay. Inside the dialog the background
            is also white, so the icon was invisible until hover tinted the
            button behind it.
          */}
          <Icons.ModalXMark
            color="var(--text-secondary)"
            width={32}
            height={32}
          />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};