import React from 'react';
import BaseFormLayout from '../../components/layouts/BaseFormLayout';
import { useAlbumForm } from '../../hooks/useAlbumForm';

interface AlbumFormProps {
  isEdit?: boolean;
}

export default function AlbumForm({ isEdit = false }: AlbumFormProps) {
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
  } = useAlbumForm(isEdit);

  return (
    <BaseFormLayout
      title={isEdit ? 'Edit Album' : 'New Album'}
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
            placeholder="Album Title"
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

        <div className="mt-2 flex flex-col gap-2">
          <label className="block text-xs font-bold text-gray-700">
            Images Grid
          </label>

          <div className="grid grid-cols-3 gap-2 border border-dashed border-gray-300 p-3 rounded-sm bg-gray-50/50">
            {albumImages.map((src, index) => (
              <div
                key={index}
                className="aspect-square relative rounded-xs overflow-hidden border border-gray-200 group"
              >
                <img
                  src={src}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute inset-0 bg-black/40 text-white font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs cursor-pointer transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}

            <label className="aspect-square flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-xs bg-white hover:bg-gray-50 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors">
              <span className="text-lg font-light">+</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleAddImages}
              />
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          rows={6}
          placeholder="Album Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-900 placeholder-gray-300 text-gray-800 resize-none leading-relaxed"
        />
      </div>
    </BaseFormLayout>
  );
}
