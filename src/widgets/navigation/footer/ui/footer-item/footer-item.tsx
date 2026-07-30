import React, { FC, ReactNode } from 'react'
import Link from 'next/link'
import { getClasses } from './styles/get-classes'

type FooterItemProps =
  | {
      href: string
      children: ReactNode
      className?: string
    }
  | {
      href?: never
      children: ReactNode
      className?: string
    }
  

export const FooterItem: FC<FooterItemProps> = ({ href, children, className }) => {
  const {cnItem} = getClasses({className})
  if (href) {
    return (
      <Link href={href} className={cnItem}>
        {children}
      </Link>
    )
  }

  return <div className={cnItem}>{children}</div>
}

FooterItem.displayName = 'FooterItem'
