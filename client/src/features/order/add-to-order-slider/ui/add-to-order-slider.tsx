'use client';

import { ProductCard } from '@/src/entities/product';
import { useProductModalContext } from '@/src/features/product/product-add-to-cart-modal/model/context/hooks';
import { Icons } from '@/src/shared/assets/svg/components';
import { CategoryId } from '@/src/shared/config';
import { getCategoryLabel } from '@/src/shared/config/categories/categories';
import { Buttons } from '@/src/shared/ui';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useUpsellProducts } from '../api';
import { useSwiperNav } from '../model/use-swiper-nav';
import { getClasses } from './styles/get-classes';

type AddToOrderSliderProps = {
  categoryId: CategoryId;
};

export const AddToOrderSlider = ({ categoryId }: AddToOrderSliderProps) => {
  const { data, isLoading } = useUpsellProducts(categoryId);
  const { open } = useProductModalContext();
  const { cnRoot, cnCard, cnNavNext, cnNavPrev, cnLabel } = getClasses();
  const {
    onSwiper,
    onSlideChange,
    slideNext,
    slidePrev,
    canSlidePrev,
    canSlideNext,
  } = useSwiperNav();

  if (isLoading || !data?.length) return null;

  return (
    <section className={cnRoot}>
      <h2 className={cnLabel}>{getCategoryLabel(categoryId)}</h2>

      {canSlidePrev && (
        <Buttons.IconButton
          circle
          onClick={slidePrev}
          className={cnNavPrev}
          icon={
            <Icons.LeftArrow
              color="var(--icon-primary)"
              width={20}
              height={20}
            />
          }
        />
      )}

      <Swiper
        modules={[Navigation]}
        slidesPerView={4}
        spaceBetween={20}
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          520: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          850: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1500: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
      >
        {data.map(product => (
          <SwiperSlide key={product.id} >
            <ProductCard
              forSlider
              className={cnCard}
              {...product}
              onClick={() => open(product)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {canSlideNext && (
        <Buttons.IconButton
          circle
          onClick={slideNext}
          className={cnNavNext}
          icon={
            <Icons.RightArrow
              color="var(--icon-primary)"
              width={20}
              height={20}
            />
          }
        />
      )}
    </section>
  );
};
