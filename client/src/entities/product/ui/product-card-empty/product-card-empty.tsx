import { WithClassNames } from '@/src/shared/types'
import { FC } from 'react';
import { getProductCardEmptyClasses } from './styles/get-classes'
import emptyImg from '@/public/images/empty.png'; 
import Image from 'next/image'


export const ProductCardEmpty: FC<WithClassNames> = ({ className }) => {
  const { cnCard, cnImageWrapper, cnImage, cnContent, cnText } =
    getProductCardEmptyClasses({ className });

  return (
     <div className={cnCard}>
      <div className={cnImageWrapper}>
        <Image
          src={emptyImg}
          alt="Пусто"
          fill

          className={cnImage}
          priority={false}
        />
      </div>

      <div className={cnContent}>
        <span className={cnText}>Ничего не найдено :(</span>
        <span className={cnText}>Сбросьте фильтры</span>
      </div>
    </div>
  );
};

ProductCardEmpty.displayName = 'ProductCardEmpty'