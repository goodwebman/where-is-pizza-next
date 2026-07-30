'use client'
import {
  selectOpenDrawerCategory,
  selectSelectedFiltersByCategory,
} from '@/src/entities/filters/model/selectors';
import {
  closeFiltersDrawer,
  setFilters,
} from '@/src/entities/filters/model/slice';
import { EMPTY_FILTERS, FiltersMap } from '@/src/entities/filters/model/types';
import { useAppDispatch, useAppSelector } from '@/src/shared/store/redux-store';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

export const useProductFiltersDrawer = () => {
  const dispatch = useAppDispatch();
  const openDrawerCategory = useSelector(selectOpenDrawerCategory);

  const selectedFilters = useAppSelector(
    openDrawerCategory
      ? selectSelectedFiltersByCategory(openDrawerCategory)
      : () => EMPTY_FILTERS,
  );

  const [draftFilters, setDraftFilters] = useState<FiltersMap>(selectedFilters);

  const toggleDraft = useCallback((group: string, option: string) => {
    setDraftFilters(prev => {
      const values = prev[group] || [];
      return {
        ...prev,
        [group]: values.includes(option)
          ? values.filter(v => v !== option)
          : [...values, option],
      };
    });
  }, []);

  const resetDraft = useCallback(() => setDraftFilters({}), []);

  const applyDraft = useCallback(() => {
    if (!openDrawerCategory) return;
    dispatch(
      setFilters({ categoryId: openDrawerCategory, filters: draftFilters }),
    );
    dispatch(closeFiltersDrawer());
  }, [dispatch, draftFilters, openDrawerCategory]);

  const close = useCallback(() => dispatch(closeFiltersDrawer()), [dispatch]);

  return {
    openDrawerCategory,
    draftFilters,
    toggleDraft,
    resetDraft,
    applyDraft,
    close,
  };
};
