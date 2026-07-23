import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../../../services/user.service';
import { PROFILE_CONSTANTS } from '../../../constants/profile.constant';
import { getBackendMessage } from '../../../utils/error';
import { useAuth } from '../../../contexts/auth.context';
import {
  validateProfileForm,
  type ProfileFormErrors,
} from '../validations/profile.validation';

export function useUserProfileAction() {
  const { refreshSession } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userService
      .getMe()
      .then((res) => {
        let userData = res?.data || res;
        if (userData && userData.data) {
          userData = userData.data;
        }
        if (userData) {
          setForm({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            avatarUrl: userData.avatarUrl || '',
          });
        }
      })
      .catch((err: unknown) => {
        toast.error(
          getBackendMessage(
            err,
            PROFILE_CONSTANTS.API_RESPONSE.FETCH_PROFILE_FAILED
          )
        );
      });
  }, []);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ProfileFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          avatar: 'Accepted formats are JPEG and PNG.',
        }));
        return;
      }

      if (file.size > PROFILE_CONSTANTS.LIMITS.MAX_AVATAR_SIZE_BYTES) {
        setErrors((prev) => ({
          ...prev,
          avatar: PROFILE_CONSTANTS.VALIDATION.FILE_TOO_LARGE(
            PROFILE_CONSTANTS.LIMITS.MAX_AVATAR_SIZE_MB
          ),
        }));
        return;
      }

      setAvatarFile(file);
      setForm((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(file),
      }));

      if (errors.avatar) {
        setErrors((prev) => ({ ...prev, avatar: undefined }));
      }
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ProfileFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInfoSubmit = async (
    e: React.FormEvent,
    isChangingPassword: boolean
  ) => {
    e.preventDefault();

    const validationErrors = validateProfileForm(
      form,
      passwordForm,
      isChangingPassword
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName.trim());
      formData.append('lastName', form.lastName.trim());
      formData.append('email', form.email.trim());

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (isChangingPassword) {
        formData.append('oldPassword', passwordForm.currentPassword);
        formData.append('password', passwordForm.newPassword);
      }

      await userService.updateProfile(formData);
      await refreshSession();

      setAvatarFile(null);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success(PROFILE_CONSTANTS.API_RESPONSE.UPDATE_SUCCESS);
    } catch (err: unknown) {
      toast.error(
        getBackendMessage(err, PROFILE_CONSTANTS.API_RESPONSE.UPDATE_FAILED)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    setForm,
    handleFormChange,
    passwordForm,
    errors,
    isLoading,
    handleInfoSubmit,
    handlePasswordChange,
    handleFileChange,
  };
}
