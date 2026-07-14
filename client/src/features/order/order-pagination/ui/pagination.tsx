'use client';

import { Icons } from '@/src/shared/assets/svg/components';
import { FC, useCallback } from 'react';
import { getClasses } from './styles/get-classes';

type PaginationProps = {
  page: number;
  totalPages: number;
  pages: (number | '...')[];
  onPageChange: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  pages,
  onPageChange,
}) => {
  const { cnContainer, cnButton, cnDots } = getClasses();

  const handlePrev = useCallback(() => {
    onPageChange(page - 1);
  }, [page, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(page + 1);
  }, [page, onPageChange]);

  if (totalPages <= 1) return null;
  return (
    <nav className={cnContainer} aria-label="Пагинация">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={cnButton({
          arrow: true,
          arrowActive: page !== 1,
          disabled: page === 1,
        })}
        aria-label="Предыдущая страница"
      >
        <Icons.LeftArrow width={15} height={15} color="var(--icon-primary)" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className={cnDots} aria-hidden="true">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cnButton({ active: p === page })}
            aria-label={`Страница ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={cnButton({
          arrow: true,
          arrowActive: page !== totalPages,
          disabled: page === totalPages,
        })}
        aria-label="Следующая страница"
      >
        <Icons.RightArrow width={15} height={15} color="var(--icon-primary)" />
      </button>
    </nav>
  );
};

Pagination.displayName = 'Pagination';
