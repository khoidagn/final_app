import { useUserProfileAction } from '../Profile/hooks/useUserProfileAction';
import AccountSettingLayout from '../../components/layouts/AccountSettingLayout';
import BackButton from '../../components/ui/BackButton';

export default function AdminProfile() {
  const profileActionHook = useUserProfileAction();

  return (
    <AccountSettingLayout
      title="Admin Profile Settings"
      profileActionHook={profileActionHook}
      actionButtonSlot={<BackButton to="/admin/users" />}
    />
  );
}
