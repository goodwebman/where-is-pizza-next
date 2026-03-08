import { useMemo, useState } from 'react';
import { getClasses } from '../ui/styles/get-classes';

interface Params {
  total: number;
  perPage: number;
}

export const useOrderPagination = ({ total: initialTotal, perPage }: Params) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);

  const { cnContainer, cnButton, cnActive, cnArrow, cnDisabled } =
    getClasses({});

  const totalPages = Math.ceil(total / perPage);

  const pages = useMemo(() => {
    const result: (number | '...')[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
      return result;
    }

    result.push(1);

    if (page > 3) result.push('...');

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) result.push(i);

    if (page < totalPages - 2) result.push('...');

    result.push(totalPages);

    return result;
  }, [page, totalPages]);

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className={cnContainer}>
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
          className={`${cnButton} ${cnArrow} ${page === 1 ? cnDisabled : ''}`}
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={i}>...</span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`${cnButton} ${p === page ? cnActive : ''}`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
          className={`${cnButton} ${cnArrow} ${
            page === totalPages ? cnDisabled : ''
          }`}
        >
          ›
        </button>
      </div>
    );
  };

  return {
    page,
    setTotal,
    Pagination,
  };
};