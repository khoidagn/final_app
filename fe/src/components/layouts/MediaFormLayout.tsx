import React from 'react';
import { cn } from '../../utils/cn';
import BackButton from '../../components/ui/BackButton';

interface MediaFormLayoutProps {
  title: string;
  isEdit: boolean;
  isSubmitting?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  backTo?: string;
  children: React.ReactNode;
}

export default function MediaFormLayout({
  title,
  isEdit,
  isSubmitting = false,
  onSubmit,
  onDelete,
  backTo,
  children,
}: MediaFormLayoutProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col',
        'p-3 sm:p-6',
        'bg-surface border-0 sm:border sm:border-border-default rounded-none sm:rounded-md shadow-none sm:shadow-xs'
      )}
    >
      <div
        className={cn(
          'w-full flex items-center justify-between pb-3 mb-4 sm:mb-6',
          'border-b border-border-default'
        )}
      >
        <h2 className={cn('text-base font-bold text-text-primary')}>{title}</h2>
        <BackButton to={backTo} />
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
            'border-t border-border-muted',
            'justify-end sm:justify-start'
          )}
        >
          {isEdit && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isSubmitting}
              className={cn(
                'text-white text-xs font-semibold px-3 py-1.5 rounded-sm shadow-2xs transition-all cursor-pointer focus:outline-none flex items-center gap-1',
                'bg-danger hover:bg-danger-hover',
                'active:scale-95 transform transition-transform',
                'disabled:opacity-50 disabled:cursor-not-allowed'
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'text-white text-xs font-semibold px-5 py-1.5 rounded-sm shadow-2xs transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-2 min-w-[75px]',
              'bg-success hover:bg-success-hover',
              'active:scale-95 transform transition-transform',
              'disabled:opacity-70 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
