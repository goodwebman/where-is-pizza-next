import { UserProfileSectionsTabs } from '@/src/features/user/user-profile-sections-tabs/user-profile-sections-tabs';
import { checkSession } from '@/src/shared/lib/helpers/auth';
import styles from './layout.module.scss';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await checkSession();

  return (
    <section className={styles.layout}>
      {session && <UserProfileSectionsTabs />}

      {children}
    </section>
  );
}
