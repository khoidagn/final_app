import { useState, type MouseEvent } from 'react';
import { Heart } from 'lucide-react';

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
      className={`inline-flex items-center cursor-pointer transition-colors focus:outline-none bg-transparent border-none p-0 ${
        isLiked
          ? 'text-red-500 font-semibold'
          : 'text-gray-400 hover:text-red-500'
      }`}
    >
      <Heart
        size={13}
        className="mr-1 transition-colors"
        stroke={isLiked ? '#ef4444' : '#1e3a8a'}
        fill={isLiked ? '#ef4444' : 'none'}
        strokeWidth={2.5}
      />
      <span className="leading-none">{likesCount}</span>
    </button>
  );
}
