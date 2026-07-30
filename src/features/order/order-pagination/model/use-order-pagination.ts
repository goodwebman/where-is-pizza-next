import { useMemo, useState } from 'react';

interface Params {
  total: number;
  perPage: number;
}

const buildPages = (page: number, totalPages: number): (number | '...')[] => {
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
};

export const useOrderPagination = ({ total, perPage }: Params) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(total / perPage);

  const pages = useMemo(
    () => buildPages(page, totalPages),
    [page, totalPages],
  );

  return { page, setPage, pages, totalPages } as const;
};
