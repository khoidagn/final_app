import React from 'react';
import { getAvatarInitials } from '../../utils/string';
import { cn } from '../../utils/cn';

interface AvatarProps {
  firstName: string | undefined;
  lastName: string | undefined;
  avatarUrl?: string;
  sizeClass?: string;
  textSizeClass?: string;
  bgColorClass?: string;
  textColorClass?: string;
}

export default function Avatar({
  firstName,
  lastName,
  avatarUrl,
  sizeClass = 'w-8 h-8',
  textSizeClass = 'text-xs',
  bgColorClass = 'bg-surface',
  textColorClass = 'text-brand',
}: AvatarProps) {
  if (avatarUrl) {
    return (
      <div
        className={cn(
          'rounded-full overflow-hidden shrink-0 border border-white/20 shadow-2xs',
          sizeClass
        )}
      >
        <img
          src={avatarUrl}
          alt="User Avatar"
          className={cn('w-full h-full object-cover')}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full font-bold flex items-center justify-center shrink-0 select-none',
        sizeClass,
        bgColorClass,
        textColorClass,
        textSizeClass
      )}
    >
      {getAvatarInitials(firstName, lastName)}
    </div>
  );
}
