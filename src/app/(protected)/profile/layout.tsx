import { redirect } from 'next/navigation';

import { UserProfileSectionsTabs } from '@/src/features/user/user-profile-sections-tabs/user-profile-sections-tabs';
import { getServerSession } from '@/src/server/auth/session';
import { ROUTES } from '@/src/shared/config';
import styles from './layout.module.scss';

/**
 * Server-side guard. Previously this was a client component that rendered the
 * page and only then redirected from an effect, so an anonymous visitor saw the
 * protected content flash by before being bounced.
 *
 * Reading cookies here makes this segment dynamic — correct for a per-user page,
 * and exactly why it must not be done in the root layout, where it would take
 * ISR on the home page down with it.
 */
export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) redirect(ROUTES.HOME);

  return (
    <section className={styles.layout}>
      <UserProfileSectionsTabs />
      {children}
    </section>
  );
}
