import { UserProfileSectionsTabs } from '@/src/features/user/user-profile-sections-tabs/user-profile-sections-tabs';
import { getServerSession } from '@/src/server/auth/session';
import styles from './layout.module.scss';

/**
 * The guard used to sit here and bounced every anonymous visitor to the home
 * page, which also made "Заказы" in the header look dead: guests do have an order
 * history, keyed by the guest cookie (see Order.guestId). Access control now
 * lives on /profile/settings — the only segment that genuinely needs an account.
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

  return (
    <section className={styles.layout}>
      <UserProfileSectionsTabs isAuthenticated={Boolean(session)} />
      {children}
    </section>
  );
}
