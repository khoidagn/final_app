import { cn } from '../../../utils/cn';

interface SocialAuthButtonsProps {
  isLoading?: boolean;
  mode?: 'signin' | 'signup';
  onGoogleClick?: () => void;
  onFacebookClick?: () => void;
  onTwitterClick?: () => void;
}

export default function SocialAuthButtons({
  isLoading = false,
  mode = 'signin',
  onGoogleClick,
  onFacebookClick,
  onTwitterClick,
}: SocialAuthButtonsProps) {
  const actionText = mode === 'signup' ? 'Sign up' : 'Sign in';

  return (
    <div
      className={cn(
        'p-5 pt-3 border-t flex flex-col gap-2 border-border-muted bg-background/30'
      )}
    >
      {/* GOOGLE */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onGoogleClick}
        className={cn(
          'w-full h-8 border rounded-xs flex items-center justify-center space-x-2 shadow-2xs transition-all focus:outline-none px-3 cursor-pointer',
          'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary active:scale-98 transform',
          'disabled:opacity-60 disabled:cursor-not-allowed'
        )}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className={cn('w-3.5 h-3.5 shrink-0')}
        />
        <span className={cn('text-xs font-medium')}>
          {actionText} with Google
        </span>
      </button>

      {/* FACEBOOK */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onFacebookClick}
        className={cn(
          'w-full h-8 border rounded-xs flex items-center justify-center space-x-2 shadow-2xs transition-all focus:outline-none px-3 cursor-pointer',
          'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary active:scale-98 transform',
          'disabled:opacity-60 disabled:cursor-not-allowed'
        )}
      >
        <img
          src="https://www.svgrepo.com/show/475647/facebook-color.svg"
          alt="Facebook"
          className={cn('w-3.5 h-3.5 shrink-0')}
        />
        <span className={cn('text-xs font-medium')}>
          {actionText} with Facebook
        </span>
      </button>

      {/* TWITTER */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onTwitterClick}
        className={cn(
          'w-full h-8 border rounded-xs flex items-center justify-center space-x-2 shadow-2xs transition-all focus:outline-none px-3 cursor-pointer',
          'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary active:scale-98 transform',
          'disabled:opacity-60 disabled:cursor-not-allowed'
        )}
      >
        <img
          src="https://www.svgrepo.com/show/475689/twitter-color.svg"
          alt="Twitter"
          className={cn('w-3.5 h-3.5 shrink-0')}
        />
        <span className={cn('text-xs font-medium')}>
          {actionText} with Twitter
        </span>
      </button>
    </div>
  );
}
