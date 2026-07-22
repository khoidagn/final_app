import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { adminService } from '../../../services/admin.service';
import { ADMIN_CONSTANTS } from '../../../constants/admin.constant';
import { getBackendMessage } from '../../../utils/error';

export function useAdminEditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? parseInt(id, 10) : null;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const loadUserDetail = async () => {
      try {
        setIsLoading(true);
        const userData = await adminService.getUserById(userId);

        if (userData) {
          setForm({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            avatarUrl: userData.avatarUrl || '/default-avatar.jpg',
          });
          setIsActive(
            userData.isActive !== undefined ? userData.isActive : true
          );
        }
      } catch (error: unknown) {
        toast.error(
          getBackendMessage(
            error,
            ADMIN_CONSTANTS.API_RESPONSE.FETCH_USER_FAILED
          )
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUserDetail();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > ADMIN_CONSTANTS.LIMITS.MAX_AVATAR_SIZE_BYTES) {
        toast.warning(
          ADMIN_CONSTANTS.VALIDATION.FILE_TOO_LARGE(
            ADMIN_CONSTANTS.LIMITS.MAX_AVATAR_SIZE_MB
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

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('firstName', form.firstName.trim());
      formData.append('lastName', form.lastName.trim());
      formData.append('email', form.email.trim());

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (password.trim()) {
        formData.append('password', password);
      }

      await adminService.updateUserProfile(userId, formData);
      await adminService.toggleUserStatus(userId, isActive);

      toast.success(ADMIN_CONSTANTS.API_RESPONSE.UPDATE_USER_SUCCESS);
      navigate('/admin/users');
    } catch (error: unknown) {
      toast.error(
        getBackendMessage(
          error,
          ADMIN_CONSTANTS.API_RESPONSE.UPDATE_USER_FAILED
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userId) return;

    try {
      setIsDeleting(true);
      await adminService.deleteUser(userId);
      toast.success(ADMIN_CONSTANTS.API_RESPONSE.DELETE_USER_SUCCESS);
      setIsConfirmOpen(false);
      navigate('/admin/users');
    } catch (error: unknown) {
      toast.error(
        getBackendMessage(
          error,
          ADMIN_CONSTANTS.API_RESPONSE.DELETE_USER_FAILED
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    form,
    setForm,
    password,
    setPassword,
    isActive,
    setIsActive,
    isLoading,
    isSubmitting,
    isDeleting,
    isConfirmOpen,
    setIsConfirmOpen,
    handleAdminSubmit,
    handleFileChange,
    handleOpenDeleteModal,
    handleConfirmDelete,
    navigate,
  };
}
