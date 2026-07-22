import { useEffect } from 'react';
import { cn } from '../../utils/cn';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={!isLoading ? onClose : undefined}
      />

      <div
        className={cn(
          'relative w-full max-w-sm bg-surface border border-border-default rounded-md p-5 shadow-lg z-10',
          'animate-in zoom-in-95 duration-150'
        )}
      >
        <h3 className="text-base font-bold text-text-primary">{title}</h3>

        <p className="text-xs text-text-muted mt-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-sm border border-border-default bg-surface text-text-secondary hover:bg-background transition-colors cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={cn(
              'px-4 py-1.5 text-xs font-semibold rounded-sm text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 transform',
              isDanger
                ? 'bg-danger hover:bg-danger-hover'
                : 'bg-brand hover:bg-brand-hover',
              'disabled:opacity-70 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
