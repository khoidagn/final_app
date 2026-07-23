import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { photoService } from '../../../services/photo.service';
import { adminService } from '../../../services/admin.service';
import { getBackendMessage } from '../../../utils/error';
import { PHOTO_CONSTANTS } from '../../../constants/photo.constant';
import { SharingMode, type SharingModeType } from '../../../types/enum.type';
import type { PhotoFormData } from '../../../types/photo.type';
import {
  validatePhotoForm,
  type PhotoFormErrors,
} from '../validations/photo.validation';

export function usePhotoForm(isEdit: boolean, isAdmin: boolean = false) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const photoId = id ? parseInt(id, 10) : null;

  const [formData, setFormData] = useState<PhotoFormData>({
    title: '',
    sharingMode: SharingMode.PUBLIC,
    description: '',
    previewSrc: '',
    imageFile: null,
  });

  const [fieldErrors, setFieldErrors] = useState<PhotoFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isEdit && photoId) {
      const fetchPhotoDetails = async () => {
        try {
          setIsLoading(true);
          const res = isAdmin
            ? await adminService.getPhotoById(photoId)
            : await photoService.getPhotoById(photoId);

          const photo = res?.data || res;

          if (photo) {
            setFormData({
              title: photo.title || '',
              sharingMode: photo.sharingMode as SharingModeType,
              description: photo.description || '',
              previewSrc: photo.media?.imageUrl || '',
              imageFile: null,
            });
          }
        } catch (error: unknown) {
          const errorMsg = getBackendMessage(
            error,
            PHOTO_CONSTANTS.API_RESPONSE.FETCH_FAILED
          );
          toast.error(errorMsg);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPhotoDetails();
    }
  }, [isEdit, photoId, isAdmin]);

  const handleFieldChange = <K extends keyof PhotoFormData>(
    field: K,
    value: PhotoFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field as keyof PhotoFormErrors]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        previewSrc: URL.createObjectURL(file),
      }));

      if (fieldErrors.file) {
        setFieldErrors((prev) => ({ ...prev, file: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🟢 Truyền cả previewSrc vào để chặn Save nếu người dùng xóa hết ảnh
    const errors = validatePhotoForm(
      {
        title: formData.title,
        description: formData.description,
        sharingMode: formData.sharingMode,
        file: formData.imageFile,
        previewSrc: formData.previewSrc,
      },
      isEdit
    );

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const apiFormData = new FormData();
      apiFormData.append('title', formData.title.trim());
      apiFormData.append('description', formData.description.trim());
      apiFormData.append('sharingMode', formData.sharingMode);

      if (formData.imageFile) {
        apiFormData.append('photo', formData.imageFile);
      }

      if (isEdit && photoId) {
        if (isAdmin) {
          await adminService.updatePhoto(photoId, apiFormData);
        } else {
          await photoService.updatePhoto(photoId, apiFormData);
        }
        toast.success(PHOTO_CONSTANTS.API_RESPONSE.UPDATE_SUCCESS);
      } else {
        await photoService.uploadPhoto(apiFormData);
        toast.success(PHOTO_CONSTANTS.API_RESPONSE.UPLOAD_SUCCESS);
      }

      navigate(isAdmin ? '/admin/photos' : '/my-profile?tab=photos');
    } catch (error: unknown) {
      const fallbackMsg = isEdit
        ? PHOTO_CONSTANTS.API_RESPONSE.UPDATE_FAILED
        : PHOTO_CONSTANTS.API_RESPONSE.UPLOAD_FAILED;
      toast.error(getBackendMessage(error, fallbackMsg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!photoId) return;

    try {
      setIsDeleting(true);
      if (isAdmin) {
        await adminService.deletePhoto(photoId);
      } else {
        await photoService.deletePhoto(photoId);
      }
      toast.success(PHOTO_CONSTANTS.API_RESPONSE.DELETE_SUCCESS);
      setIsConfirmOpen(false);
      navigate(isAdmin ? '/admin/photos' : '/my-profile?tab=photos');
    } catch (error: unknown) {
      toast.error(
        getBackendMessage(error, PHOTO_CONSTANTS.API_RESPONSE.DELETE_FAILED)
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    formData,
    fieldErrors,
    setFormData,
    handleFieldChange,
    handleFileChange,
    handleSubmit,
    handleDelete: handleOpenDeleteModal,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    isLoading,
    isSubmitting,
    isDeleting,
  };
}
