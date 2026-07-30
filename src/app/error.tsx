'use client';

import { useEffect } from 'react';

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
    <main style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1>Что-то пошло не так</h1>
      <p>Мы уже разбираемся. Попробуйте обновить страницу.</p>
      <button type="button" onClick={reset} style={{ marginTop: '1.5rem' }}>
        Попробовать снова
      </button>
    </main>
  );
}
