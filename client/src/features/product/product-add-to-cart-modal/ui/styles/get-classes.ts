import classNames from 'classnames/bind';
import classes from './product-add-to-cart-modal.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  selected?: boolean;
};

export const getClasses = ({ className, selected }: Args) => {
  const cnModal = cn('modal')
  const cnRoot = cn('root', className);
  const cnImage = cn('image');
  const cnImageWrapper = cn('image-wrapper');
  const cnOptions = cn('options');
  const cnOptionsHeader = cn('options--header');
  const cnOptionsLabel = cn('options--label');
  const cnOptionsSublabel = cn('options--sublabel');
  const cnIngredients = cn('ingredients', {
    'ingredients--selected': selected,
  });
  const cnIngredientsLabel = cn('ingredients--label');

  const cnIngredientsWrapper = cn('ingredients--wrapper');

  const cnFooter = cn('footer')
  const cnFooterLeft = cn('footer--left')

  return {
    cnModal,
    cnRoot,
    cnImage,
    cnImageWrapper,
    cnOptions,
    cnOptionsHeader,
    cnOptionsLabel,
    cnIngredients,
    cnFooterLeft,
    cnOptionsSublabel,
    cnIngredientsLabel,
    cnIngredientsWrapper,
    cnFooter
  };
};
