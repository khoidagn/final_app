import React from 'react';
import BaseFormLayout from '../../components/layouts/BaseFormLayout';
import AlbumFormFields from '../../components/forms/AlbumFormFields';
import { useAlbumForm } from '../../hooks/useAlbumForm';

export default function AdminEditAlbum() {
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
  } = useAlbumForm(false); 

  return (
    <BaseFormLayout
      title="Edit Album - Admin"  
      isEdit={true}
      onSubmit={handleSubmit}
      onDelete={handleDelete} 
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
