'use client'
import { useRef, useState, useCallback } from 'react';
import type { Swiper as SwiperClass } from 'swiper/types';

export const useSwiperNav = () => {
  const swiperRef = useRef<SwiperClass | null>(null);

  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(true);

  const updateState = useCallback((swiper: SwiperClass) => {
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  }, []);

  const onSwiper = useCallback((swiper: SwiperClass) => {
    swiperRef.current = swiper;
    updateState(swiper);
  }, [updateState]);

  const onSlideChange = useCallback((swiper: SwiperClass) => {
    updateState(swiper);
  }, [updateState]);

  const slideNext = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.animating) return;
    swiper.slideNext();
  }, []);

  const slidePrev = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.animating) return;
    swiper.slidePrev();
  }, []);

  return {
    onSwiper,
    onSlideChange,
    // For events that change what "first/last slide" means without changing the
    // active slide - resize and breakpoint switches.
    syncNav: updateState,
    slideNext,
    slidePrev,
    canSlidePrev,
    canSlideNext,
  };
};