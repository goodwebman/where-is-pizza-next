'use client';

import { useEffect } from 'react';

import errorImg from '@/public/images/error.png';
import { Buttons, EmptyState } from '@/src/shared/ui';
import Image from 'next/image';
// Same page shell as the 404 — both are "a page you cannot use right now".
import styles from './not-found.module.scss';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <EmptyState
        media={<Image src={errorImg} alt="" width={120} height={120} />}
        title="Что-то пошло не так"
        description="Мы уже разбираемся. Попробуйте открыть страницу заново."
        action={
          <Buttons.DefaultButton onClick={reset}>
            Попробовать снова
          </Buttons.DefaultButton>
        }
      />
    </main>
  );
}
