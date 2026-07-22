import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  minHeight?: string;
  className?: string;
  text?: string;
}

export default function LoadingSpinner({
  minHeight = 'min-h-[400px]',
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center p-6',
        'bg-surface border border-border-default rounded-md',
        minHeight,
        className
      )}
    >
      <div
        className={cn(
          'w-8 h-8 border-4 rounded-full animate-spin',
          'border-border-default border-t-brand'
        )}
      />
      {text && (
        <p className={cn('mt-3 text-xs text-text-muted font-medium')}>{text}</p>
      )}
    </div>
  );
}
