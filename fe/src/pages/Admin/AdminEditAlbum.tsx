import MediaFormLayout from '../../components/layouts/MediaFormLayout';
import AlbumFormFields from '../../components/forms/AlbumFormFields';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAlbumForm } from '../Albums/hooks/useAlbumForm';
import { ALBUM_CONSTANTS } from '../../constants/album.constant';

export default function AdminEditAlbum() {
  const {
    title,
    setTitle,
    sharingMode,
    setSharingMode,
    description,
    setDescription,
    albumImages,
    fieldErrors,
    handleAddImages,
    handleRemoveImage,
    handleSubmit,
    handleDelete,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    isLoading,
    isSubmitting,
    isDeleting,
  } = useAlbumForm(true, true);

  if (isLoading) {
    return (
      <LoadingSpinner
        text="Loading album content for Admin..."
        minHeight="min-h-[300px]"
      />
    );
  }

  return (
    <>
      <MediaFormLayout
        title="Edit Album - Admin Mode"
        isEdit={true}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        backTo="/admin/albums"
      >
        <AlbumFormFields
          title={title}
          setTitle={setTitle}
          sharingMode={sharingMode}
          setSharingMode={setSharingMode}
          description={description}
          setDescription={setDescription}
          albumImages={albumImages}
          fieldErrors={fieldErrors}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
        />
      </MediaFormLayout>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Album (Admin)?"
        description={ALBUM_CONSTANTS.CONFIRM.DELETE_ADMIN}
        confirmText="Delete Album"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
