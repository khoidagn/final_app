import React, { useState, type MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LikeButtonProps {
  initialLikes: number;
  initialIsLiked?: boolean;
  photoId?: number;
}

export default function LikeButton({
  initialLikes,
  initialIsLiked = false,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLikeToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={cn(
        'inline-flex items-center cursor-pointer transition-all focus:outline-none bg-transparent border-none p-0',
        'active:scale-90 transform transition-transform',
        isLiked
          ? 'text-danger font-semibold'
          : 'text-text-muted hover:text-danger'
      )}
    >
      <Heart
        size={12}
        className={cn('mr-1 mb-1 transition-colors')}
        stroke={isLiked ? 'var(--color-danger)' : 'var(--color-brand)'}
        fill={isLiked ? 'var(--color-danger)' : 'none'}
        strokeWidth={2.5}
      />
      <span className={cn('leading-none')}>{likesCount}</span>
    </button>
  );
}
