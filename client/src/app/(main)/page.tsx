import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { EMPTY_FILTERS } from '@/src/entities/filters/model/types';
import { CATEGORIES } from '@/src/shared/config';

import { getFiltersQuery } from '@/src/entities/filters/api/filters.queries';
import { getProductsQuery } from '@/src/entities/product/api/product.queries';
import { ProductCategoryContainer } from '@/src/widgets/product/product-category-section/mediator/product-category-container';

export const dynamic = 'force-dynamic';

export default async function MainPage() {
  const queryClient = new QueryClient();

  await Promise.all(
    CATEGORIES.flatMap(categoryId => [
      queryClient.prefetchQuery(getProductsQuery(categoryId, EMPTY_FILTERS)),
      queryClient.prefetchQuery(getFiltersQuery(categoryId)),
    ]),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductCategoryContainer />
    </HydrationBoundary>
  );
}
