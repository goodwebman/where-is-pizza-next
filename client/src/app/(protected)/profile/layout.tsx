'use client';
import { selectIsAuthorized } from '@/src/entities/session';
import { UserProfileSectionsTabs } from '@/src/features/user/user-profile-sections-tabs/user-profile-sections-tabs';
import { useAppSelector } from '@/src/shared/store/redux-store';
import styles from './layout.module.scss';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useAppSelector(selectIsAuthorized);

  return (
    <section className={styles.layout}>
      {session && <UserProfileSectionsTabs />}

      {children}
    </section>
  );
}
