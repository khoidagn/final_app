import { useNavigate } from 'react-router-dom';
import { useUserProfileAction } from './hooks/useUserProfileAction';
import AccountSettingLayout from '../../components/layouts/AccountSettingLayout';
import BackButton from '../../components/ui/BackButton';
import DangerZone from './components/DangerZone';

export default function EditProfile() {
  const navigate = useNavigate();
  const profileActionHook = useUserProfileAction();

  return (
    <AccountSettingLayout
      title="Edit Profile"
      profileActionHook={profileActionHook}
      actionButtonSlot={<BackButton to="/my-profile" />}
      dangerZoneSlot={<DangerZone onDeleteSuccess={() => navigate('/login')} />}
    />
  );
}
