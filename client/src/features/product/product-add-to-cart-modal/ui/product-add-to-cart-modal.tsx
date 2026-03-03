'use client';
import { IngredientIcon } from '@/src/entities/ingredient';
import { useLockBodyScroll } from '@/src/shared/hooks';
import { Buttons, Modal } from '@/src/shared/ui';
import { TabsRoot } from '@/src/shared/ui/tabs/tabs';
import Image from 'next/image';
import { getClasses } from './styles/get-classes';

import { ProductDetails } from '@/src/entities/product/model/types';
import { useProductModalContext } from '../model/context/hooks';
import {
  useAddProductToCartHandler,
  useProductImageSize,
  useProductOptions,
} from '../model/hooks';
import { Icons } from '@/src/shared/assets/svg/components'

export const ProductAddToCartModal = () => {
  const { product, isOpen, close } = useProductModalContext();
  useLockBodyScroll(isOpen);

  const modalContent = product ? (
    <ProductModalContent key={product.id} product={product} close={close} />
  ) : null;

  return <>{modalContent}</>;
};

type ProductModalContentProps = {
  product: ProductDetails;
  close: () => void;
};
const ProductModalContent = ({ product, close }: ProductModalContentProps) => {
  const { selected, handleOptionClick, totalPrice, totalWeight } =
    useProductOptions(product);
  const { width, height } = useProductImageSize(product, selected);
  const { handleAddToCart, loading } = useAddProductToCartHandler(close);
  const {
    cnModal,
    cnRoot,
    cnCalories,
    cnImageWrapper,
    cnImage,
    cnOptions,
    cnCaloriesIcon,
    cnCaloriesOverlay,
    cnOptionsSublabel,
    cnOptionsLabel,
    cnFooter,
    cnIngredientsButton,
    cnFooterLeft,
    cnIngredients,
    cnIngredientsLabel,
    cnIngredientsWrapper,
    cnTitleRow
  } = getClasses({});

  return (
    <Modal className={cnModal} isOpen={!!product} onClose={close}>
      <section className={cnRoot}>
        <div className={cnImageWrapper}>
          <Image
            className={cnImage}
            src={product.imageSrc}
            alt={product.title}
            width={width}
            height={height}
          />
        </div>
        <aside className={cnOptions}>
          <div className={cnTitleRow}>
            <h2 className={cnOptionsLabel}>{product.title}</h2>

            <div className={cnCalories}>
              <button
                className={cnCaloriesIcon}
                aria-label="Информация о калориях"
                type="button"
              >
                <Icons.Info width={24} height={24} />
              </button>

              <div className={cnCaloriesOverlay}>
                {product.nutrition?.caloriesPer100g && (
                  <p>Белки: {product.nutrition?.caloriesPer100g} г</p>
                )}
                {product.nutrition?.fatsPer100g && (
                  <p>Жиры: {product.nutrition?.fatsPer100g} г</p>
                )}
                {product.nutrition?.carbsPer100g && (
                  <p>Углеводы: {product.nutrition?.carbsPer100g} г</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <ul className={cnIngredientsWrapper}>
              {product.ingredients.map(ing => (
                <li key={ing.id}>
                  <div className={cnIngredients}>
                    <IngredientIcon id={ing.id} />
                  </div>

                  <p className={cnIngredientsLabel}>{ing.label}</p>
                </li>
              ))}
            </ul>
          </div>

          {product.options?.map(option => (
            <div key={option.id}>
              <div className={cnOptionsSublabel}>{option.title}</div>

              {option.type === 'single' ? (
                <TabsRoot
                  tabs={option.values.map(v => ({
                    label: v.title,
                    value: v.id,
                  }))}
                  activeTab={selected[option.id]?.[0]}
                  onChange={value => handleOptionClick(option, value as string)}
                />
              ) : (
                <div className={cnIngredientsWrapper}>
                  {option.values.map(value => {
                    const isSelected = selected[option.id]?.includes(value.id);
                    const { cnIngredients } = getClasses({
                      selected: isSelected,
                    });
                    return (
                      <div key={value.id}>
                        <button
                          key={value.id}
                          onClick={() => handleOptionClick(option, value.id)}
                          className={cnIngredientsButton}
                        >
                          <div className={cnIngredients}>
                            <IngredientIcon id={value.slug} />
                          </div>

                          <p className={cnIngredientsLabel}>{value.title}</p>
                          <p className={cnIngredientsLabel}>{value.price} ₽</p>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div className={cnFooter}>
            <div className={cnFooterLeft}>
              <h1>Итого: {totalPrice}₽</h1>
              <p>{totalWeight} г</p>
            </div>
            <Buttons.DefaultButton
              onClick={() => product && handleAddToCart(product, selected)}
              disabled={loading}
            >
              {loading ? 'Добавление...' : 'Добавить'}
            </Buttons.DefaultButton>
          </div>
        </aside>
      </section>
    </Modal>
  );
};
