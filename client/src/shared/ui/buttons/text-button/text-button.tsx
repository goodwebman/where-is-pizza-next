import { ComponentPropsWithRef, FC, ReactNode } from 'react'
import { ButtonSize } from '../types'
import { getClasses } from './styles/get-classes'

type CustomTextButtonProps = {
  children: ReactNode
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  size?: ButtonSize
  className?: string
}

type TextButtonProps = CustomTextButtonProps &
  ComponentPropsWithRef<'button'>

export const TextButton: FC<TextButtonProps> = ({
  children,
  icon,
  iconPosition = 'left',
  size = 'medium',
  className,
  disabled,
  type = 'button',
  ...props
}) => {
  const { cnRoot, cnIcon, cnContent } = getClasses({
    size,
    className,
    disabled,
    iconPosition,
  })

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={cnRoot}
    >
      {icon && iconPosition === 'left' && (
        <span className={cnIcon}>{icon}</span>
      )}

      <span className={cnContent}>{children}</span>

      {icon && iconPosition === 'right' && (
        <span className={cnIcon}>{icon}</span>
      )}
    </button>
  )
}

TextButton.displayName = 'TextButton'