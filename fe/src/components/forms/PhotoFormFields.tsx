import React from 'react';
import ImageUploadBox from '../ui/ImageUploadBox';
import { cn } from '../../utils/cn';
import { SharingMode, type SharingModeType } from '../../types/enum.type';
import type { PhotoFormData } from '../../types/photo.type';
import { type PhotoFormErrors } from '../../pages/Photos/validations/photo.validation';

interface PhotoFormFieldsProps {
  formData: PhotoFormData;
  fieldErrors?: PhotoFormErrors;
  setFormData: React.Dispatch<React.SetStateAction<PhotoFormData>>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldChange?: <K extends keyof PhotoFormData>(
    field: K,
    value: PhotoFormData[K]
  ) => void;
}

export default function PhotoFormFields({
  formData,
  fieldErrors = {},
  setFormData,
  onFileChange,
  onFieldChange,
}: PhotoFormFieldsProps) {
  const handleChange = <K extends keyof PhotoFormData>(
    field: K,
    value: PhotoFormData[K]
  ) => {
    if (onFieldChange) {
      onFieldChange(field, value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, previewSrc: '', imageFile: null }));
  };

  return (
    <>
      <div className={cn('flex flex-col gap-4 w-full')}>
        <div>
          <label
            className={cn('block text-xs font-bold text-text-primary mb-1.5')}
          >
            Title <span className={cn('text-red-500')}>*</span>
          </label>
          <input
            type="text"
            placeholder="Photo Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
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
            value={formData.sharingMode}
            onChange={(e) =>
              handleChange('sharingMode', e.target.value as SharingModeType)
            }
            className={cn(
              'w-36 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none text-text-primary cursor-pointer transition-all',
              'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
            )}
          >
            <option value={SharingMode.PUBLIC}>Public</option>
            <option value={SharingMode.PRIVATE}>Private</option>
          </select>
        </div>

        <div className={cn('mt-1')}>
          <label
            className={cn('block text-xs font-bold text-text-primary mb-1.5')}
          >
            Photo <span className={cn('text-red-500')}>*</span>
          </label>
          <ImageUploadBox
            imageSrc={formData.previewSrc}
            onChange={onFileChange}
            onRemove={handleRemoveImage}
          />
          {fieldErrors.file && (
            <p className={cn('text-[11px] text-red-500 mt-1 font-medium')}>
              {fieldErrors.file}
            </p>
          )}
        </div>
      </div>

      <div className={cn('flex flex-col w-full h-full')}>
        <label
          className={cn('block text-xs font-bold text-text-primary mb-1.5')}
        >
          Description <span className={cn('text-red-500')}>*</span>
        </label>
        <textarea
          rows={9}
          placeholder="Photo Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
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
