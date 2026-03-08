import { selectIsAuthorized } from '@/src/entities/session';
import { UserPasswordChange } from '@/src/features/user/user-change-password/ui/user-password-change/user-password-change';
import { UserInfoChange } from '@/src/features/user/user-update-data/ui/user-info-change/user-info-change';
import { useAppSelector } from '@/src/shared/store/redux-store';
import { getClasses } from './styles/get-classes';

export const ProfileSettings = () => {
  const { cnContainer } = getClasses({});
  
  return (
    <section className={cnContainer}>
      <UserInfoChange />
      <UserPasswordChange />
    </section>
  );
};
