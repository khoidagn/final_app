/**
    AvatarInitials = FistLetter + LastLetter
 */
export const getAvatarInitials = (firstName: string | undefined, lastName: string | undefined): string => {
  if (!firstName || !lastName) return '';
  
  const firstLetter = firstName.trim().charAt(0).toUpperCase();
  const lastLetter = lastName.trim().charAt(0).toUpperCase();
  
  return `${firstLetter}${lastLetter}`;
};

/**
    "Hansford", "Nguyen" -> "Hansford Nguyen"
 */
export const getFullName = (firstName: string | undefined, lastName: string | undefined): string => {
  if (!firstName && !lastName) return '';
  return `${firstName || ''} ${lastName || ''}`.trim();
};