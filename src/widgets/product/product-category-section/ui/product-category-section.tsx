'use client';

import { FiltersMap } from '@/src/entities/filters/model/types';
import { Product, ProductDetails } from '@/src/entities/product/model/types';
import {
  ProductCard,
  ProductCardError,
  ProductCardSkeleton,
} from '@/src/entities/product/ui';
import { ProductCardEmpty } from '@/src/entities/product/ui/product-card-views/product-card-empty';
import { Icons } from '@/src/shared/assets/svg/components';
import { CategoryId } from '@/src/shared/config';
import { WithClassNames } from '@/src/shared/types';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type ProductCategorySectionProps = {
  id?: string;
  categoryId: CategoryId;
  label: string;
  products: Product[];
  filters?: FiltersMap;
  /** How many options are currently applied — shown on the filter button. */
  selectedFiltersCount?: number;
  isLoading?: boolean;
  isError?: boolean;
  onOpenFilters?: (categoryId: CategoryId) => void;
  onProductClick: (product: ProductDetails) => void;
};

export const ProductCategorySection: FC<
  WithClassNames<ProductCategorySectionProps>
> = ({
  id,
  categoryId,
  label,
  products,
  filters,
  selectedFiltersCount = 0,
  onOpenFilters,
  isLoading,
  isError,
  onProductClick,
  className,
}) => {
  const {
    cnHeader,
    cnHeaderLabel,
    cnFilterButton,
    cnFilterCount,
    cnProductsContainer,
    cnSection,
  } = getClasses({ className, hasSelectedFilters: selectedFiltersCount > 0 });

  const hasFilters = Boolean(filters && Object.keys(filters).length);
  const emptyProducts = products.length === 0;

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ));
    }

    if (isError) {
      return Array.from({ length: 5 }).map((_, i) => (
        <ProductCardError key={i} />
      ));
    }

    if (emptyProducts) {
      return <ProductCardEmpty />;
    }

    return products.map((product, index) => (
      <ProductCard
        onClick={() => onProductClick(product)}
        categoryId={product.categoryId}
        key={product.id}
        index={index}
        id={product.id}
        title={product.title}
        imageSrc={product.imageSrc}
        ingredients={product.ingredients}
        price={product.price}
        badge={product.badge}
      />
    ));
  };

  return (
    <section className={cnSection} id={id}>
      <div className={cnHeader}>
        <h2 className={cnHeaderLabel}>{label}</h2>

        {hasFilters && onOpenFilters && (
          <button
            type="button"
            className={cnFilterButton}
            onClick={() => onOpenFilters(categoryId)}
            // The badge is decorative for screen readers — the count belongs in
            // the button's own name instead.
            aria-label={
              selectedFiltersCount > 0
                ? `Фильтры, выбрано: ${selectedFiltersCount}`
                : 'Фильтры'
            }
          >
            <Icons.Filter width={16} height={16} />
            <span>Фильтры</span>

            {selectedFiltersCount > 0 && (
              <span className={cnFilterCount} aria-hidden="true">
                {selectedFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      <div className={cnProductsContainer}>{renderContent()}</div>
    </section>
  );
};
