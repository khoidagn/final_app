import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../../components/ui/Avatar';
import { getFullName } from '../../../utils/string';
import { type Author } from '../../../types/feeds';

interface AuthorBadgeProps {
  author: Author;
  sizeClass?: string;
  textSizeClass?: string;
}

export default function AuthorBadge({
  author,
  sizeClass = 'w-5 h-5',
  textSizeClass = 'text-[9px]',
}: AuthorBadgeProps) {
  const navigate = useNavigate();

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigate(`/profile/${author.id}`);
  };

  return (
    <div
      onClick={handleBadgeClick}
      className="flex items-center space-x-1.5 min-w-0 cursor-pointer group/badge select-none"
    >
      <Avatar
        firstName={author.first_name}
        lastName={author.last_name}
        avatarUrl={author.avatar_url}
        sizeClass={sizeClass}
        textSizeClass={textSizeClass}
        bgColorClass="bg-blue-900"
        textColorClass="text-white"
      />
      <span className="text-xs font-semibold text-blue-900 truncate group-hover/badge:underline decoration-blue-950">
        {getFullName(author.first_name, author.last_name)}
      </span>
    </div>
  );
}
