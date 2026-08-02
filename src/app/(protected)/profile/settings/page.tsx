import { redirect } from 'next/navigation';

import { getServerSession } from '@/src/server/auth/session';
import { ROUTES } from '@/src/shared/config';
import { ProfileSettings } from '@/src/widgets';

/**
 * Server-side guard, moved down from the profile layout: settings edit an
 * account, so they still require one — unlike the sibling orders page, which is
 * now open to guests.
 */
const ProfileSettingsPage = async () => {
  const session = await getServerSession();

  if (!session) redirect(ROUTES.HOME);

  return <ProfileSettings />;
};

export default ProfileSettingsPage;
