'use client';

// import { ProductModalProvider } from '@/src/features/product/product-add-to-cart-modal/model/context/product-modal-context';
import { ProductCategoryContainer } from '@/src/widgets/product/product-category-section/mediator/product-category-container';

export default function MainPage() {
  return (
    <section>
    
        <ProductCategoryContainer />
   
    </section>
  );
}
