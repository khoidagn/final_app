import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { albumService } from '../../../services/album.service';
import { adminService } from '../../../services/admin.service';
import { getBackendMessage } from '../../../utils/error';
import { ALBUM_CONSTANTS } from '../../../constants/album.constant';
import type { AlbumImageLocal } from '../../../types/feeds.type';
import type { AlbumDetailData } from '../../../types/album.type';
import { SharingMode } from '../../../types/enum.type';

export function useAlbumForm(isEdit: boolean, isAdmin: boolean = false) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const albumId = id ? parseInt(id, 10) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sharingMode, setSharingMode] = useState<'PUBLIC' | 'PRIVATE'>(
    'PUBLIC'
  );
  const [albumImages, setAlbumImages] = useState<AlbumImageLocal[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isEdit && albumId) {
      const fetchAlbumDetails = async () => {
        try {
          setIsLoading(true);
          const res = isAdmin
            ? await adminService.getAlbumById(albumId)
            : await albumService.getAlbumById(albumId);

          const album = (res?.data || res) as AlbumDetailData;

          if (album) {
            setTitle(album.title || '');
            setDescription(album.description || '');
            setSharingMode(album.sharingMode || SharingMode.PUBLIC);

            if (album.albumMedias) {
              const mappedImages: AlbumImageLocal[] = album.albumMedias.map(
                (item) => ({
                  id: item.media.id,
                  previewUrl: item.media?.imageUrl || '',
                })
              );
              setAlbumImages(mappedImages);
            }
          }
        } catch (error: unknown) {
          const errorMsg = getBackendMessage(
            error,
            ALBUM_CONSTANTS.API_RESPONSE.FETCH_FAILED
          );
          toast.error(errorMsg);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAlbumDetails();
    }
  }, [isEdit, albumId, isAdmin]);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    if (
      albumImages.length + selectedFiles.length >
      ALBUM_CONSTANTS.LIMITS.MAX_IMAGES
    ) {
      toast.warning(
        ALBUM_CONSTANTS.VALIDATION.MAX_IMAGES_EXCEEDED(
          ALBUM_CONSTANTS.LIMITS.MAX_IMAGES
        )
      );
      e.target.value = '';
      return;
    }

    const isOverSize = selectedFiles.some(
      (file) => file.size > ALBUM_CONSTANTS.LIMITS.MAX_FILE_SIZE_BYTES
    );
    if (isOverSize) {
      toast.warning(
        ALBUM_CONSTANTS.VALIDATION.FILE_TOO_LARGE(
          ALBUM_CONSTANTS.LIMITS.MAX_FILE_SIZE_MB
        )
      );
      e.target.value = '';
      return;
    }

    const newImages: AlbumImageLocal[] = selectedFiles.map((file, index) => ({
      id: `local-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setAlbumImages((prev) => [...prev, ...newImages]);

    e.target.value = '';
  };

  const handleRemoveImage = (imageId: string | number) => {
    setAlbumImages((prev) => {
      const target = prev.find((img) => img.id === imageId);
      if (target?.file) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning(ALBUM_CONSTANTS.VALIDATION.TITLE_REQUIRED);
      return;
    }

    if (!description.trim()) {
      toast.warning(ALBUM_CONSTANTS.VALIDATION.DESCRIPTION_REQUIRED);
      return;
    }

    if (!isEdit && albumImages.length === 0) {
      toast.warning(ALBUM_CONSTANTS.VALIDATION.AT_LEAST_ONE_IMAGE);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('sharingMode', sharingMode);

      if (isEdit && albumId) {
        const remainingImageIds = albumImages
          .filter((img) => !img.file)
          .map((img) => Number(img.id));

        formData.append('remainingImages', JSON.stringify(remainingImageIds));

        albumImages.forEach((img) => {
          if (img.file) {
            formData.append('images', img.file);
          }
        });

        if (isAdmin) {
          await adminService.updateAlbum(albumId, formData);
        } else {
          await albumService.updateAlbum(albumId, formData);
        }

        toast.success(ALBUM_CONSTANTS.API_RESPONSE.UPDATE_SUCCESS);
        navigate(isAdmin ? '/admin/albums' : '/my-profile?tab=albums');
      } else {
        albumImages.forEach((img) => {
          if (img.file) {
            formData.append('images', img.file);
          }
        });

        await albumService.uploadAlbum(formData);
        toast.success(ALBUM_CONSTANTS.API_RESPONSE.CREATE_SUCCESS);
        navigate('/my-profile?tab=albums');
      }
    } catch (error: unknown) {
      const fallbackMsg = isEdit
        ? ALBUM_CONSTANTS.API_RESPONSE.UPDATE_FAILED
        : ALBUM_CONSTANTS.API_RESPONSE.CREATE_FAILED;
      toast.error(getBackendMessage(error, fallbackMsg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!albumId) return;

    try {
      setIsDeleting(true);
      if (isAdmin) {
        await adminService.deleteAlbum(albumId);
      } else {
        await albumService.deleteAlbum(albumId);
      }
      toast.success(ALBUM_CONSTANTS.API_RESPONSE.DELETE_SUCCESS);
      setIsConfirmOpen(false);
      navigate(isAdmin ? '/admin/albums' : '/my-profile?tab=albums');
    } catch (error: unknown) {
      toast.error(
        getBackendMessage(error, ALBUM_CONSTANTS.API_RESPONSE.DELETE_FAILED)
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    title,
    setTitle,
    sharingMode,
    setSharingMode,
    description,
    setDescription,
    albumImages,
    handleAddImages,
    handleRemoveImage,
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
