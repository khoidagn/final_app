import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LikeButtonProps {
  initialLikes: number;
  initialIsLiked?: boolean;
  photoId?: number;
  onToggle?: () => void;
}

export default function LikeButton({
  initialLikes,
  initialIsLiked = false,
  onToggle,
}: LikeButtonProps) {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      className={cn(
        'inline-flex items-center cursor-pointer focus:outline-none bg-transparent border-none p-0',
        'active:scale-90 transform transition-transform select-none',
        initialIsLiked
          ? 'text-danger font-semibold'
          : 'text-text-muted hover:text-danger'
      )}
    >
      <Heart
        size={12}
        className={cn(
          'mr-1 transition-all duration-200',
          initialIsLiked && 'scale-110'
        )}
        stroke={initialIsLiked ? 'var(--color-danger)' : 'currentColor'}
        fill={initialIsLiked ? 'var(--color-danger)' : 'none'}
        strokeWidth={2.5}
      />
      <span className={cn('leading-none text-[11px] font-semibold')}>
        {initialLikes}
      </span>
    </button>
  );
}
