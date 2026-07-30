import Link from 'next/link';

import { ROUTES } from '@/src/shared/config';

export default function NotFound() {
  return (
    <main style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1>Страница не найдена</h1>
      <p>Возможно, ссылка устарела или адрес введён с ошибкой.</p>
      <Link href={ROUTES.HOME} style={{ display: 'inline-block', marginTop: '1.5rem' }}>
        На главную
      </Link>
    </main>
  );
}
