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
      className={`focus:outline-none transition-all duration-200 ${textSizeClass} font-bold px-3 py-1 rounded-full border cursor-pointer ${
        isFollowing
          ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
          : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
