import classNames from 'classnames/bind'
import classes from './social-info.module.scss'

const cn = classNames.bind(classes)

type Args = {
  className?: string
}

export const getSocialInfoClasses = ({ className }: Args) => {
  return {
    cnRoot: cn('root', className),
    cnIcon: cn('icon'),
    cnText: cn('text'),
  }
}
