import BaseFormLayout from '../../components/layouts/BaseFormLayout';
import AlbumFormFields from '../../components/forms/AlbumFormFields';
import { useAlbumForm } from '../../hooks/useAlbumForm';

export default function NewAlbum() {
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
  } = useAlbumForm(false);

  return (
    <BaseFormLayout
      title="New Album"
      isEdit={false}
      onSubmit={handleSubmit}
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
    </BaseFormLayout>
  );
}
