import { WithClassNames } from '@/src/shared/types'
import { FC } from 'react';
import { getProductCardErrorClasses } from './styles/get-classes'
import errorImg from '@/public/images/error.png'; 
import Image from 'next/image'


export const ProductCardError: FC<WithClassNames> = ({ className }) => {
  const { cnCard, cnImageWrapper, cnImage, cnContent, cnText } =
    getProductCardErrorClasses({ className });

  return (
     <div className={cnCard}>
      <div className={cnImageWrapper}>
        <Image
          src={errorImg}
          alt="Пусто"
          fill
          className={cnImage}
          priority={false}
        />
      </div>

      <div className={cnContent}>
        <span className={cnText}>Что-то пошло не так...</span>
       
      </div>
    </div>
  );
};