import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface BaseFormLayoutProps {
  title: string;
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  backTo?: string;
  children: React.ReactNode;
}

export default function BaseFormLayout({
  title,
  isEdit,
  onSubmit,
  onDelete,
  backTo,
  children,
}: BaseFormLayoutProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col p-6',
        'bg-surface border border-border-default rounded-md shadow-xs'
      )}
    >
      <div
        className={cn(
          'w-full flex items-center justify-between pb-3 mb-6',
          'border-b border-border-default'
        )}
      >
        <h2 className={cn('text-base font-bold text-text-primary')}>{title}</h2>
        <button
          type="button"
          onClick={handleBackClick}
          className={cn(
            'text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs text-decoration-none transition-colors cursor-pointer border border-transparent',
            'text-white bg-brand hover:bg-brand-hover',
            'active:scale-95 transform transition-transform'
          )}
        >
          Back
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className={cn(
          'w-full grid grid-cols-1 gap-y-4',
          'md:grid-cols-2 md:gap-x-8'
        )}
      >
        {children}

        <div
          className={cn(
            'flex items-center gap-3 pt-4 mt-4 md:col-span-2',
            'border-t border-border-muted'
          )}
        >
          <button
            type="submit"
            className={cn(
              'text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer focus:outline-none',
              'bg-success hover:bg-success-hover',
              'active:scale-95 transform transition-transform'
            )}
          >
            Save
          </button>

          {isEdit && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className={cn(
                'text-white text-xs font-semibold px-3 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer focus:outline-none flex items-center gap-1',
                'bg-danger hover:bg-danger-hover',
                'active:scale-95 transform transition-transform'
              )}
            >
              <svg
                className={cn('w-3.5 h-3.5')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
