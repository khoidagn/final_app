import { getAvatarInitials } from '../utils/string';

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
  sizeClass = "w-8 h-8", 
  textSizeClass = "text-xs",
  bgColorClass = "bg-white",
  textColorClass = "text-blue-900" 
}: AvatarProps) {
  
  if (avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden shrink-0 border border-white/20 shadow-2xs`}>
        <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-full ${bgColorClass} ${textColorClass} font-bold flex items-center justify-center shrink-0 select-none ${textSizeClass}`}>
      {getAvatarInitials(firstName, lastName)}
    </div>
  );
}