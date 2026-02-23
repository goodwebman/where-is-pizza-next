import classNames from 'classnames/bind'
import classes from './product-card.module.scss'

const cn = classNames.bind(classes)

type CardArgs = {
  badge?: 'new' | 'popular'
  className?: string
}

export const getProductCardClasses = ({ badge, className }: CardArgs) => {
  const cnCard = cn('card', className)
  const cnImageWrapper = cn('imageWrapper')
  const cnImage = cn('image')
  const cnContent = cn('content')
  const cnTitle = cn('title')
  const cnIngredients = cn('ingredients')
  const cnFooter = cn('footer')
  const cnButton = cn('button')
  const cnPrice = cn('price')

  const cnBadge = cn('badge', {
    new: badge === 'new',
    popular: badge === 'popular',
  })

  return {
    cnCard,
    cnImageWrapper,
    cnImage,
    cnContent,
    cnTitle,
    cnIngredients,
    cnFooter,
    cnButton,
    cnPrice,
    cnBadge,
  }
}

