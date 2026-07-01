import React from 'react';
import { cn } from '../../utils/cn';

interface FormDataType {
  first_name: string;
  last_name: string;
  email: string;
}

interface UserProfileFormFieldsProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

export default function UserProfileFormFields({
  formData,
  setFormData,
}: UserProfileFormFieldsProps) {
  const handleInputChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={cn('flex flex-col gap-4 w-full')}>
      <div
        className={cn(
          'flex flex-col gap-2 w-full',
          'sm:flex-row sm:items-center sm:gap-4'
        )}
      >
        <label
          className={cn(
            'text-xs font-bold text-text-secondary text-left shrink-0',
            'sm:w-32 sm:text-right'
          )}
        >
          First Name
        </label>
        <input
          type="text"
          value={formData.first_name}
          onChange={(e) => handleInputChange('first_name', e.target.value)}
          className={cn(
            'flex-1 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
            'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
          )}
          required
        />
      </div>

      <div
        className={cn(
          'flex flex-col gap-2 w-full',
          'sm:flex-row sm:items-center sm:gap-4'
        )}
      >
        <label
          className={cn(
            'text-xs font-bold text-text-secondary text-left shrink-0',
            'sm:w-32 sm:text-right'
          )}
        >
          Last Name
        </label>
        <input
          type="text"
          value={formData.last_name}
          onChange={(e) => handleInputChange('last_name', e.target.value)}
          className={cn(
            'flex-1 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
            'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
          )}
          required
        />
      </div>

      <div
        className={cn(
          'flex flex-col gap-2 w-full',
          'sm:flex-row sm:items-center sm:gap-4'
        )}
      >
        <label
          className={cn(
            'text-xs font-bold text-text-secondary text-left shrink-0',
            'sm:w-32 sm:text-right'
          )}
        >
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={cn(
            'flex-1 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
            'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
          )}
          required
        />
      </div>
    </div>
  );
}
