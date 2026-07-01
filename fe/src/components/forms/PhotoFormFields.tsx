import React from 'react';
import ImageUploadBox from '../ui/ImageUploadBox';
import { cn } from '../../utils/cn';

interface PhotoFormData {
  title: string;
  sharingMode: string;
  description: string;
  previewSrc: string;
}

interface PhotoFormFieldsProps {
  formData: PhotoFormData;
  setFormData: React.Dispatch<React.SetStateAction<PhotoFormData>>;
}

export default function PhotoFormFields({
  formData,
  setFormData,
}: PhotoFormFieldsProps) {
  const handleChange = (field: keyof PhotoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className={cn('flex flex-col gap-4 w-full')}>
        <div>
          <label
            className={cn('block text-xs font-bold text-text-primary mb-1.5')}
          >
            Title
          </label>
          <input
            type="text"
            placeholder="Photo Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={cn(
              'w-full bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
              'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
            )}
            required
          />
        </div>

        <div>
          <label
            className={cn('block text-xs font-bold text-text-primary mb-1.5')}
          >
            Sharing mode
          </label>
          <select
            value={formData.sharingMode}
            onChange={(e) => handleChange('sharingMode', e.target.value)}
            className={cn(
              'w-36 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none text-text-primary cursor-pointer transition-all',
              'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
            )}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className={cn('mt-2')}>
          <ImageUploadBox imageSrc={formData.previewSrc} />
        </div>
      </div>

      <div className={cn('flex flex-col w-full h-full')}>
        <label
          className={cn('block text-xs font-bold text-text-primary mb-1.5')}
        >
          Description
        </label>
        <textarea
          rows={9}
          placeholder="Photo Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={cn(
            'w-full flex-1 bg-surface border rounded-sm px-3 py-2 text-xs focus:outline-none placeholder-text-muted text-text-primary resize-none leading-relaxed transition-all min-h-[220px]',
            'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
          )}
          required
        />
      </div>
    </>
  );
}
