import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../../components/ui/Avatar';
import { getFullName } from '../../../utils/string';
import { type UserSummary } from '../../../types/feeds.type';
import { cn } from '../../../utils/cn';

interface AuthorBadgeProps {
  author: UserSummary;
  sizeClass?: string;
  textSizeClass?: string;
}

export default function AuthorBadge({
  author,
  sizeClass = 'w-5 h-5',
  textSizeClass = 'text-[9px]',
}: AuthorBadgeProps) {
  const navigate = useNavigate();

  if (!author) return null;

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${author.id}`);
  };

  const fName = author.firstName || '';
  const lName = author.lastName || '';
  const url = author.avatarUrl || null;

  return (
    <div
      onClick={handleBadgeClick}
      className={cn(
        'flex items-center space-x-1.5 min-w-0 cursor-pointer group/badge select-none transform transition-transform',
        'active:scale-98'
      )}
    >
      <Avatar
        firstName={fName}
        lastName={lName}
        avatarUrl={url}
        sizeClass={sizeClass}
        textSizeClass={textSizeClass}
        bgColorClass="bg-brand"
        textColorClass="text-white"
      />
      <span
        className={cn(
          'text-xs font-semibold truncate group-hover/badge:underline',
          'text-brand decoration-brand'
        )}
      >
        {getFullName(fName, lName) || `User #${author.id}`}
      </span>
    </div>
  );
}
