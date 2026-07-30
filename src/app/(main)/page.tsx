import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { filtersQueryKey } from '@/src/entities/filters/api/filters.keys';
import { EMPTY_FILTERS } from '@/src/entities/filters/model/types';
import { productsQueryKey } from '@/src/entities/product/api/product.keys';
import { getAllProductsGrouped } from '@/src/server/services/product.service';
import { CATEGORIES, FILTERS_MAP } from '@/src/shared/config';
import { ProductCategoryContainer } from '@/src/widgets/product/product-category-section/mediator/product-category-container';

// Static literal: Next cannot analyse an expression here and silently drops the
// segment config if it is not one, which is how ISR ended up disabled before.
export const revalidate = 600;

export default async function MainPage() {
  const queryClient = new QueryClient();

  // One query for the whole catalogue, called in-process. This used to be 14
  // HTTP prefetches to a separate service, and they did not even await: the
  // `.map` produced arrays of promises, so `Promise.all` resolved immediately
  // and the dehydrated cache shipped empty.
  const productsByCategory = await getAllProductsGrouped();

  for (const categoryId of CATEGORIES) {
    queryClient.setQueryData(
      productsQueryKey(categoryId, EMPTY_FILTERS),
      productsByCategory[categoryId] ?? [],
    );

    // Filters are a static constant — there is nothing to fetch.
    queryClient.setQueryData(
      filtersQueryKey(categoryId),
      FILTERS_MAP[categoryId],
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductCategoryContainer />
    </HydrationBoundary>
  );
}
