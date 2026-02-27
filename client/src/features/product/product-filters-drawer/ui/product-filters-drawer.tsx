'use client';

import { FiltersMap } from '@/src/entities/filters/model/types';
import { WithClassNames } from '@/src/shared/types';
import { Buttons, Drawer } from '@/src/shared/ui';
import { TagButton } from '@/src/shared/ui/tag-selector/tag-button';
import { TagContainer } from '@/src/shared/ui/tag-selector/tag-container';
import { FC, useMemo } from 'react';
import { GROUP_TRANSLATIONS } from '../model/group-translations';
import { useProductFiltersDrawer } from '../model/use-product-filters';
import { getProductFiltersDrawerClasses } from './styles/get-classes';

type ProductFiltersDrawerProps = { filters: FiltersMap };

export const ProductFiltersDrawer: FC<
  WithClassNames<ProductFiltersDrawerProps>
> = ({ filters, className }) => {
  const {
    openDrawerCategory,
    draftFilters,
    toggleDraft,
    resetDraft,
    applyDraft,
    close,
  } = useProductFiltersDrawer();

  const {
    cnDrawerContent,
    cnFilterGroup,
    cnGroupLabel,
    cnGroupOptions,
    cnDrawerFooter,
    cnResetBtn,
    cnApplyBtn,
  } = getProductFiltersDrawerClasses({ className });

  const filterEntries = useMemo(() => Object.entries(filters), [filters]);

  return (
    <Drawer
      isOpen={Boolean(openDrawerCategory)}
      onClose={close}
      label="Фильтры"
    >
      <TagContainer className={cnDrawerContent}>
        {filterEntries.map(([group, options]) => {
          const label = GROUP_TRANSLATIONS[group] ?? group;
          return (
            <div key={group} className={cnFilterGroup}>
              <h4 className={cnGroupLabel}>{label}</h4>
              <div className={cnGroupOptions}>
                {options.map(option => (
                  <TagButton
                    key={option}
                    label={option}
                    selected={draftFilters[group]?.includes(option) ?? false}
                    onClick={() => toggleDraft(group, option)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </TagContainer>

      <div className={cnDrawerFooter}>
        <Buttons.DefaultButton
          fullWidth
          variant="ghost"
          onClick={resetDraft}
          className={cnResetBtn}
        >
          Сбросить
        </Buttons.DefaultButton>
        <Buttons.DefaultButton
          fullWidth
          onClick={applyDraft}
          className={cnApplyBtn}
        >
          Применить
        </Buttons.DefaultButton>
      </div>
    </Drawer>
  );
};
