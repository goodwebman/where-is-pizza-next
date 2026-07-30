import { NextResponse } from 'next/server';

import { prisma } from '@/src/server/db/prisma';

export const dynamic = 'force-dynamic';

/**
 * Readiness probe. Playwright's webServer waits on this rather than on the home
 * page, so a run cannot start against a server whose database is still asleep.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[health]', error);
    return NextResponse.json(
      { status: 'error', error: 'Database unavailable' },
      { status: 503 },
    );
  }
}
