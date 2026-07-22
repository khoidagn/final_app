import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../../../services/user.service';
import { PROFILE_CONSTANTS } from '../../../constants/profile.constant';
import { getBackendMessage } from '../../../utils/error';
import { useAuth } from '../../../contexts/auth.context';

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > PROFILE_CONSTANTS.LIMITS.MAX_AVATAR_SIZE_BYTES) {
        toast.warning(
          PROFILE_CONSTANTS.VALIDATION.FILE_TOO_LARGE(
            PROFILE_CONSTANTS.LIMITS.MAX_AVATAR_SIZE_MB
          )
        );
        return;
      }
      setAvatarFile(file);
      setForm((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (isChangingPassword: boolean): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (isChangingPassword) {
      if (!passwordForm.currentPassword) {
        newErrors.currentPassword =
          PROFILE_CONSTANTS.VALIDATION.CURRENT_PASSWORD_REQUIRED;
      }
      if (!passwordForm.newPassword) {
        newErrors.newPassword =
          PROFILE_CONSTANTS.VALIDATION.NEW_PASSWORD_REQUIRED;
      } else if (
        passwordForm.newPassword.length <
        PROFILE_CONSTANTS.LIMITS.MIN_PASSWORD_LENGTH
      ) {
        newErrors.newPassword =
          PROFILE_CONSTANTS.VALIDATION.NEW_PASSWORD_TOO_SHORT(
            PROFILE_CONSTANTS.LIMITS.MIN_PASSWORD_LENGTH
          );
      }
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        newErrors.confirmPassword =
          PROFILE_CONSTANTS.VALIDATION.PASSWORDS_NOT_MATCH;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInfoSubmit = async (
    e: React.FormEvent,
    isChangingPassword: boolean
  ) => {
    e.preventDefault();

    if (!validateForm(isChangingPassword)) return;

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
    passwordForm,
    errors,
    isLoading,
    handleInfoSubmit,
    handlePasswordChange,
    handleFileChange,
  };
}
