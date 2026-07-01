import React from 'react';
import BaseFormLayout from '../../components/layouts/BaseFormLayout';
import AlbumFormFields from '../../components/forms/AlbumFormFields';
import { useAlbumForm } from '../../hooks/useAlbumForm';

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
  } = useAlbumForm(true);

  return (
    <BaseFormLayout
      title="Edit Album"
      isEdit={true}
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
    </BaseFormLayout>
  );
}
