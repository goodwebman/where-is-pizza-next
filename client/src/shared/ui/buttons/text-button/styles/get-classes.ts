import classNames from 'classnames/bind'
import classes from './text-button.module.scss'
import { ButtonSize } from '../../types'

const cn = classNames.bind(classes)

type Args = {
  className?: string
  size?: ButtonSize
  disabled?: boolean
  iconPosition?: 'left' | 'right'
}

export const getClasses = ({
  className,
  size = 'medium',
  disabled,
  iconPosition,
}: Args) => {
  const cnRoot = cn(
    'button',
    size,
    {
      disabled,
      iconRight: iconPosition === 'right',
    },
    className
  )

  const cnIcon = cn('icon')
  const cnContent = cn('content')

  return {
    cnRoot,
    cnIcon,
    cnContent,
  }
}