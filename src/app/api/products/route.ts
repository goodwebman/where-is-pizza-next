import { NextResponse, type NextRequest } from 'next/server';

import { readJson, withRoute } from '@/src/server/http/route';
import { getProducts } from '@/src/server/services/product.service';
import { getProductsSchema } from '@/src/shared/contracts';

/**
 * POST for a read, kept from the old API because the filter payload is a nested
 * object and the client's query keys are built around it. The cost is that no
 * CDN can cache this response — acceptable while the home page serves the whole
 * catalogue from ISR and this endpoint only handles filtered follow-ups.
 */
export const POST = withRoute(async (request: NextRequest) => {
  const input = getProductsSchema.parse(await readJson(request));
  const products = await getProducts(input);

  return NextResponse.json(products);
});
