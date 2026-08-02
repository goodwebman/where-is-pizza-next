'use client';

import { ProductCard } from '@/src/entities/product';

import { openProductCardModal } from '@/src/features/product';
import { Icons } from '@/src/shared/assets/svg/components';
import { CategoryId } from '@/src/shared/config';
import { getCategoryLabel } from '@/src/shared/config/categories/categories';
import { useAppDispatch } from '@/src/shared/store/redux-store';
import { Buttons } from '@/src/shared/ui';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useUpsellProducts } from '../api';
import { useSwiperNav } from '../model/use-swiper-nav';
import { getClasses } from './styles/get-classes';

type AddToOrderSliderProps = {
  categoryId: CategoryId;
};

/**
 * Two full cards are visible from 320px up — never one, which made the row look
 * like a broken grid. Fractions only appear once there is room for the peeking
 * card to still be legible.
 */
const SLIDER_BREAKPOINTS = {
  0: { slidesPerView: 2, spaceBetween: 8 },
  380: { slidesPerView: 2, spaceBetween: 10 },
  520: { slidesPerView: 2.3, spaceBetween: 14 },
  768: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 20 },
  1500: { slidesPerView: 4, spaceBetween: 20 },
} as const;

export const AddToOrderSlider = ({ categoryId }: AddToOrderSliderProps) => {
  const { data, isLoading } = useUpsellProducts(categoryId);
  const dispatch = useAppDispatch();

  const { cnRoot, cnViewport, cnCard, cnNavNext, cnNavPrev, cnLabel } =
    getClasses();
  const {
    onSwiper,
    onSlideChange,
    syncNav,
    slideNext,
    slidePrev,
    canSlidePrev,
    canSlideNext,
  } = useSwiperNav();

  if (isLoading || !data?.length) return null;

  const labelId = `upsell-${categoryId}`;

  return (
    <section className={cnRoot} aria-labelledby={labelId}>
      <h2 id={labelId} className={cnLabel}>
        {getCategoryLabel(categoryId)}
      </h2>

      <div className={cnViewport}>
        {/*
          Always mounted and disabled at the ends, instead of unmounted: a button
          that vanishes on the first slide moves the whole row sideways and
          leaves no hint that the list scrolls at all.
        */}
        <Buttons.IconButton
          circle
          size="small"
          onClick={slidePrev}
          disabled={!canSlidePrev}
          className={cnNavPrev}
          aria-label="Предыдущие товары"
          icon={
            <Icons.LeftArrow color="var(--icon-primary)" width={20} height={20} />
          }
        />

        <Swiper
          modules={[Navigation]}
          grabCursor
          slidesPerView={2}
          spaceBetween={8}
          breakpoints={SLIDER_BREAKPOINTS}
          onSwiper={onSwiper}
          onSlideChange={onSlideChange}
          // Slides per view changes with the viewport, so what counts as the
          // last slide does too — without these the arrows go stale on resize.
          onResize={syncNav}
          onBreakpoint={syncNav}
        >
          {data.map((product, index) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                forSlider
                index={index}
                className={cnCard}
                {...product}
                onClick={() => dispatch(openProductCardModal(product))}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <Buttons.IconButton
          circle
          size="small"
          onClick={slideNext}
          disabled={!canSlideNext}
          className={cnNavNext}
          aria-label="Следующие товары"
          icon={
            <Icons.RightArrow
              color="var(--icon-primary)"
              width={20}
              height={20}
            />
          }
        />
      </div>
    </section>
  );
};
