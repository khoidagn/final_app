import React from 'react';

interface CarouselButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export const CarouselButton = ({ direction, onClick }: CarouselButtonProps) => {
  const isLeft = direction === 'left';

  return (
    <button
      onClick={onClick}
      className={`
        absolute ${isLeft ? 'left-4' : 'right-4'} z-20 
        w-9 h-9 flex items-center justify-center 
        text-gray-800 bg-white/70 hover:bg-white hover:text-black
        shadow-sm rounded-full transition-all duration-200 
        focus:outline-none cursor-pointer backdrop-blur-md
        opacity-0 group-hover:opacity-100 max-sm:opacity-100
        hover:scale-105 active:scale-95
      `}
      aria-label={isLeft ? 'Previous image' : 'Next image'}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {isLeft ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        )}
      </svg>
    </button>
  );
};
