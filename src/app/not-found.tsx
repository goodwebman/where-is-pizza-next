import Image from 'next/image';
import Link from 'next/link';

import pizzaImg from '@/public/images/pizzas/pizza1.png';
import { ROUTES } from '@/src/shared/config';
import { EmptyState } from '@/src/shared/ui';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <EmptyState
        media={
          <span className={styles.pizza}>
            <Image src={pizzaImg} alt="" width={220} height={220} priority />
            <span className={styles.code} aria-hidden="true">
              404
            </span>
          </span>
        }
        title="Такой страницы нет"
        description="Зато есть пицца. Возможно, ссылка устарела или в адресе опечатка."
        action={
          <Link href={ROUTES.HOME} className={styles.button}>
            Вернуться к меню
          </Link>
        }
      />
    </main>
  );
}
