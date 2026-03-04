import { UserProfileSectionsTabs } from '@/src/features/user/user-profile-sections-tabs/user-profile-sections-tabs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './layout.module.scss'

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken');

  if (!refreshToken) {
    redirect('/');
  }

  return (
    <section className={styles.layout}>
      <UserProfileSectionsTabs />
      {children}
    </section>
  );
}
