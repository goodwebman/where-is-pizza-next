interface Params {
  page: number;
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

/**
 * A pure derivation rather than the previous `useOrderPagination` hook, which
 * owned the page state *and* demanded a total. The total only exists once the
 * list query has run, and that query needs the current page — so the caller had
 * no total to give, passed a hardcoded 0, and `totalPages` stayed at 0, which
 * made <Pagination> bail out on every render. Page state now lives in the
 * widget, where it exists before the query.
 */
export const getPaginationRange = ({ page, total, perPage }: Params) => {
  const totalPages = Math.ceil(total / perPage);

  return { totalPages, pages: buildPages(page, totalPages) } as const;
};
