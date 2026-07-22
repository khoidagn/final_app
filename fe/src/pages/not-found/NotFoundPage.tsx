import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { cn } from '../../utils/cn';
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-6 font-sans antialiased text-center select-none',
        'bg-background text-text-primary'
      )}
    >
      <div
        className={cn('w-full max-w-sm mb-6 flex justify-center text-brand')}
      >
        <FileQuestion
          size={72}
          strokeWidth={1.5}
          className={cn('animate-pulse')}
        />
      </div>

      <h1
        className={cn('text-9xl font-extrabold tracking-tight mb-2 text-brand')}
      >
        404
      </h1>
      <h2 className={cn('text-lg md:text-xl font-bold text-text-primary mb-3')}>
        Page Not Found
      </h2>
      <p
        className={cn(
          'text-xs md:text-sm text-text-secondary max-w-xs md:max-w-md mx-auto mb-8 leading-relaxed'
        )}
      >
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <div className={cn('flex flex-col sm:flex-row items-center gap-3')}>
        <button
          onClick={() => navigate('/discovery')}
          className={cn(
            'px-5 py-2.5 rounded-sm text-xs font-semibold text-white bg-brand hover:bg-brand-hover shadow-2xs transition-all cursor-pointer',
            'active:scale-95 transform'
          )}
        >
          Go to Discovery
        </button>
        <button
          onClick={() => navigate(-1)}
          className={cn(
            'px-5 py-2.5 rounded-sm text-xs font-semibold border transition-all cursor-pointer',
            'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary',
            'active:scale-95 transform'
          )}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
