import { AuthGuard } from '@/src/features/auth';
import { ProfileSettings } from '@/src/widgets';

const ProfileSettingsPage = () => {
  return (
    <AuthGuard>
      <ProfileSettings />
    </AuthGuard>
  );
};

export default ProfileSettingsPage;
