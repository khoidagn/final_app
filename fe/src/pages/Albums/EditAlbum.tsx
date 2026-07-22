import MediaFormLayout from '../../components/layouts/MediaFormLayout';
import AlbumFormFields from '../../components/forms/AlbumFormFields';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useAlbumForm } from './hooks/useAlbumForm';
import { ALBUM_CONSTANTS } from '../../constants/album.constant';

export default function EditAlbum() {
  const {
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
    handleDelete,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    isLoading,
    isSubmitting,
    isDeleting,
  } = useAlbumForm(true);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-border-default border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <MediaFormLayout
        title="Edit Album"
        isEdit={true}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        backTo="/my-profile?tab=albums"
      >
        <AlbumFormFields
          title={title}
          setTitle={setTitle}
          sharingMode={sharingMode}
          setSharingMode={setSharingMode}
          description={description}
          setDescription={setDescription}
          albumImages={albumImages}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
        />
      </MediaFormLayout>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Album?"
        description={ALBUM_CONSTANTS.CONFIRM.DELETE_USER}
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
