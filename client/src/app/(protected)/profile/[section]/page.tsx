
import { ProfileOrdersHistory } from '@/src/widgets/profile/profile-orders-history/ui/profile-orders-history'
import { ProfileSettings } from '@/src/widgets/profile/profile-settings/profile-settings';

const ProfilePage = () => {
  return (
    <div>
      <ProfileSettings />

      <ProfileOrdersHistory />
    </div>
  );
};

export default ProfilePage;
