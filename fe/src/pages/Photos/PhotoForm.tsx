import React from 'react';
import BaseFormLayout from '../../components/layouts/BaseFormLayout';
import ImageUploadBox from '../../components/ui/ImageUploadBox';
import { usePhotoForm } from '../../hooks/usePhotoForm';

interface PhotoFormProps {
  isEdit?: boolean;
}

export default function PhotoForm({ isEdit = false }: PhotoFormProps) {
  const {
    title,
    setTitle,
    sharingMode,
    setSharingMode,
    description,
    setDescription,
    previewSrc,
    handleSubmit,
    handleDelete,
  } = usePhotoForm(isEdit);

  return (
    <BaseFormLayout
      title={isEdit ? 'Edit Photo' : 'New Photo'}
      isEdit={isEdit}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Title
          </label>
          <input
            type="text"
            placeholder="Photo Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 placeholder-gray-300 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Sharing mode
          </label>
          <select
            value={sharingMode}
            onChange={(e) => setSharingMode(e.target.value)}
            className="w-36 bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 text-gray-800 cursor-pointer"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="mt-2">
          <ImageUploadBox imageSrc={previewSrc} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          rows={6}
          placeholder="Photo Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-900 placeholder-gray-300 text-gray-800 resize-none leading-relaxed"
        />
      </div>
    </BaseFormLayout>
  );
}
