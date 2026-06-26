import React, { type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface EditButtonProps {
  to: string;
}

export default function EditButton({ to }: EditButtonProps) {
  const navigate = useNavigate();

  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(to);
  };

  return (
    <button
      onClick={handleEditClick}
      className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded hover:bg-black/70 cursor-pointer z-20 transition-colors focus:outline-none"
    >
      EDIT
    </button>
  );
}
