import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Pencil } from 'lucide-react';
import type { UpdateProfileFormData } from '../../types/user.type';

interface UserProfileFormFieldsProps {
  formData: UpdateProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<UpdateProfileFormData>>;
  isLoading?: boolean;
}

export default function UserProfileFormFields({
  formData,
  setFormData,
  isLoading,
}: UserProfileFormFieldsProps) {
  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  const handleInputChange = <K extends keyof UpdateProfileFormData>(
    field: K,
    value: UpdateProfileFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field: keyof typeof editableFields) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className={cn('flex flex-col gap-4 w-full')}>
      <div
        className={cn(
          'flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4'
        )}
      >
        <label
          className={cn(
            'text-xs font-bold text-text-secondary text-left shrink-0 sm:w-32 sm:text-right'
          )}
        >
          First Name
        </label>
        <div className="flex-1 flex items-center gap-2 relative">
          <input
            type="text"
            value={formData.firstName}
            disabled={!editableFields.firstName || isLoading}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={cn(
              'flex-1 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all pr-8',
              'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
              !editableFields.firstName &&
                'bg-disabled/20 border-dashed cursor-not-allowed opacity-80'
            )}
            required
          />
          <button
            type="button"
            onClick={() => toggleEdit('firstName')}
            className={cn(
              'absolute right-2 text-text-secondary hover:text-brand p-1 rounded-sm transition-colors cursor-pointer',
              editableFields.firstName && 'text-brand bg-brand/5'
            )}
          >
            <Pencil size={16} color="#616161" strokeWidth={1} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4'
        )}
      >
        <label
          className={cn(
            'text-xs font-bold text-text-secondary text-left shrink-0 sm:w-32 sm:text-right'
          )}
        >
          Last Name
        </label>
        <div className="flex-1 flex items-center gap-2 relative">
          <input
            type="text"
            value={formData.lastName}
            disabled={!editableFields.lastName || isLoading}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={cn(
              'flex-1 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all pr-8',
              'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
              !editableFields.lastName &&
                'bg-disabled/20 border-dashed cursor-not-allowed opacity-80'
            )}
            required
          />
          <button
            type="button"
            onClick={() => toggleEdit('lastName')}
            className={cn(
              'absolute right-2 text-text-secondary hover:text-brand p-1 rounded-sm transition-colors cursor-pointer',
              editableFields.lastName && 'text-brand bg-brand/5'
            )}
          >
            <Pencil size={16} color="#616161" strokeWidth={1} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4'
        )}
      >
        <label
          className={cn(
            'text-xs font-bold text-text-secondary text-left shrink-0 sm:w-32 sm:text-right'
          )}
        >
          Email
        </label>
        <div className="flex-1 flex items-center gap-2 relative">
          <input
            type="email"
            value={formData.email}
            disabled={!editableFields.email || isLoading}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={cn(
              'flex-1 bg-surface border rounded-sm px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all pr-8',
              'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
              !editableFields.email &&
                'bg-disabled/20 border-dashed cursor-not-allowed opacity-80'
            )}
            required
          />
          <button
            type="button"
            onClick={() => toggleEdit('email')}
            className={cn(
              'absolute right-2 text-text-secondary hover:text-brand p-1 rounded-sm transition-colors cursor-pointer',
              editableFields.email && 'text-brand bg-brand/5'
            )}
          >
            <Pencil size={16} color="#616161" strokeWidth={1} />
          </button>
        </div>
      </div>
    </div>
  );
}
