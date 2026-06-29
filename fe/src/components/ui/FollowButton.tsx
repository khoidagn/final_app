import { cn } from '../../utils/cn';

interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => void;
  textSizeClass?: string;
}

export default function FollowButton({
  isFollowing,
  onToggle,
  textSizeClass = 'text-[9px]',
}: FollowButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'font-bold px-3 py-1 rounded-full border cursor-pointer focus:outline-none',
        'transition-all duration-200 transform',
        textSizeClass,
        isFollowing &&
          'bg-accent text-white border-accent hover:bg-accent-hover',
        !isFollowing &&
          'bg-surface text-accent border-accent hover:bg-accent/5',
        'active:scale-95'
      )}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
