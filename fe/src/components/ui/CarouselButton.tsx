import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CarouselButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export const CarouselButton = ({ direction, onClick }: CarouselButtonProps) => {
  const isLeft = direction === 'left';

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute z-20 w-9 h-9 flex items-center justify-center rounded-full',
        isLeft ? 'left-4' : 'right-4',
        'bg-surface/70 text-text-secondary backdrop-blur-md shadow-sm',
        'hover:bg-surface hover:text-text-primary',
        'opacity-0 group-hover:opacity-100 transition-all duration-200',
        'max-sm:opacity-100',
        'cursor-pointer focus:outline-none',
        'hover:scale-105 active:scale-95 transform'
      )}
      aria-label={isLeft ? 'Previous image' : 'Next image'}
    >
      {isLeft ? (
        <ChevronLeft className={cn('w-4 h-4')} strokeWidth={2.5} />
      ) : (
        <ChevronRight className={cn('w-4 h-4')} strokeWidth={2.5} />
      )}
    </button>
  );
};
