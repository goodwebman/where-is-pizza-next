import classNames from 'classnames/bind'
import classes from './order-pagination.module.scss'

const cn = classNames.bind(classes)

type Args = {
  className?: string
}

export const getClasses = ({ className }: Args) => {
  const cnContainer = cn('container', className)
  const cnButton = cn('button')
  const cnActive = cn('active')
  const cnArrow = cn('arrow')
  const cnDisabled = cn('disabled')

  return {
    cnContainer,
    cnButton,
    cnActive,
    cnArrow,
    cnDisabled,
  }
}