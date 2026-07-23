import React from 'react';
import { cn } from '../../utils/cn';
import type { AlbumImageLocal } from '../../types/feeds.type';
import { SharingMode, type SharingModeType } from '../../types/enum.type';
import type { AlbumFormErrors } from '../../pages/Albums/validations/album.validation';

interface AlbumFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  sharingMode: SharingModeType;
  setSharingMode: React.Dispatch<React.SetStateAction<SharingModeType>>;
  description: string;
  setDescription: (value: string) => void;
  albumImages: AlbumImageLocal[];
  fieldErrors?: AlbumFormErrors;
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string | number) => void;
}

export default function AlbumFormFields({
  title,
  setTitle,
  sharingMode,
  setSharingMode,
  description,
  setDescription,
  albumImages,
  fieldErrors = {},
  onAddImages,
  onRemoveImage,
}: AlbumFormFieldsProps) {
  return (
    <>
      <div className={cn('flex flex-col gap-4 w-full')}>
        {/* Title * */}
        <div>
          <label
            className={cn('block text-xs font-bold text-text-primary mb-1.5')}
          >
            Title <span className={cn('text-red-500')}>*</span>
          </label>
          <input
            type="text"
            placeholder="Album Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn(
              'w-full bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
              fieldErrors.title
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
            )}
          />
          {fieldErrors.title && (
            <p className={cn('text-[11px] text-red-500 mt-1 font-medium')}>
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <label
            className={cn('block text-xs font-bold text-text-primary mb-1.5')}
          >
            Sharing mode
          </label>
          <select
            value={sharingMode}
            onChange={(e) => setSharingMode(e.target.value as SharingModeType)}
            className={cn(
              'w-36 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none text-text-primary cursor-pointer transition-all',
              'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
            )}
          >
            <option value={SharingMode.PUBLIC}>Public</option>
            <option value={SharingMode.PRIVATE}>Private</option>
          </select>
        </div>

        <div className={cn('mt-2 flex flex-col gap-1.5')}>
          <label className={cn('block text-xs font-bold text-text-primary')}>
            Images Grid <span className={cn('text-red-500')}>*</span>
          </label>

          <div
            className={cn(
              'grid grid-cols-3 gap-2 border border-dashed p-3 rounded-sm transition-colors',
              fieldErrors.images
                ? 'border-red-500 bg-red-50/10'
                : 'border-border-default bg-background/50'
            )}
          >
            {albumImages.map((img) => (
              <div
                key={img.id}
                className={cn(
                  'aspect-square relative rounded-xs overflow-hidden border group',
                  'border-border-default'
                )}
              >
                <img
                  src={img.previewUrl}
                  alt="Preview"
                  className={cn('w-full h-full object-cover')}
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(img.id)}
                  className={cn(
                    'absolute inset-0 bg-black/40 text-white font-bold opacity-0 flex items-center justify-center text-xs cursor-pointer transition-opacity duration-200',
                    'group-hover:opacity-100',
                    'active:scale-95 transform'
                  )}
                >
                  Remove
                </button>
              </div>
            ))}

            <label
              className={cn(
                'aspect-square flex flex-col items-center justify-center border border-dashed rounded-xs transition-colors cursor-pointer',
                'border-border-default bg-surface text-text-muted hover:bg-background hover:text-text-secondary'
              )}
            >
              <span className={cn('text-lg font-light')}>+</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif"
                className={cn('hidden')}
                onChange={onAddImages}
              />
            </label>
          </div>
          {fieldErrors.images && (
            <p className={cn('text-[11px] text-red-500 font-medium')}>
              {fieldErrors.images}
            </p>
          )}
        </div>
      </div>

      {/* Description * */}
      <div className={cn('flex flex-col w-full h-full')}>
        <label
          className={cn('block text-xs font-bold text-text-primary mb-1.5')}
        >
          Description <span className={cn('text-red-500')}>*</span>
        </label>
        <textarea
          rows={9}
          placeholder="Album Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={cn(
            'w-full flex-1 bg-surface border rounded-sm px-3 py-2 text-xs focus:outline-none placeholder-text-muted text-text-primary resize-none leading-relaxed transition-all min-h-[220px]',
            fieldErrors.description
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
          )}
        />
        {fieldErrors.description && (
          <p className={cn('text-[11px] text-red-500 mt-1 font-medium')}>
            {fieldErrors.description}
          </p>
        )}
      </div>
    </>
  );
}
