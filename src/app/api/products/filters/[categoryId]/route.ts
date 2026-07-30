import { NextResponse } from 'next/server';

import { CATEGORIES, FILTERS_MAP, isCategoryId } from '@/src/shared/config';

/**
 * Pure static data — no database, no cookies — so every category is prerendered
 * at build time.
 *
 * Deliberately not wrapped in `withRoute`: during static export Next invokes the
 * handler with a stubbed request, and touching the real NextRequest internals
 * (as the origin guard does) breaks the prerender. There is nothing to guard
 * here anyway — it is a GET over a constant.
 */
export const dynamic = 'force-static';

export const generateStaticParams = () =>
  CATEGORIES.map(categoryId => ({ categoryId }));

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  const { categoryId } = await params;

  if (!isCategoryId(categoryId)) {
    return NextResponse.json(
      { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
      { status: 404 },
    );
  }

  return NextResponse.json(FILTERS_MAP[categoryId]);
}
