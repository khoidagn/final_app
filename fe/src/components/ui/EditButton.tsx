import { type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

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
      className={cn(
        'absolute bottom-2 right-2 z-20',
        'bg-black/50 text-white font-bold rounded',
        'text-[9px] px-1.5 py-0.5',
        'hover:bg-black/70 transition-colors',
        'cursor-pointer focus:outline-none',
        'active:scale-95 transform transition-transform'
      )}
    >
      EDIT
    </button>
  );
}
