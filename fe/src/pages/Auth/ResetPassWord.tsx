import { useResetPasswordAction } from './hooks/useResetPasswordAction';
import { RESET_PASSWORD_CONSTANTS } from './constants/reset-password.constant';
import { cn } from '../../utils/cn';
import PasswordField from '../../components/ui/PasswordField';

export default function ResetPassword() {
  const {
    password,
    confirmPassword,
    isLoading,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    hasToken,
  } = useResetPasswordAction();

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center bg-background p-4 font-sans antialiased overflow-hidden'
      )}
    >
      <div
        className={cn(
          'w-full max-w-[360px] bg-surface p-5 rounded-md border border-border-default shadow-xs'
        )}
      >
        <h2
          className={cn('text-xl font-bold text-center mb-1 text-text-primary')}
        >
          {RESET_PASSWORD_CONSTANTS.UI.TITLE}
        </h2>
        <p
          className={cn(
            'text-xs text-text-secondary text-center mb-5 leading-relaxed'
          )}
        >
          {RESET_PASSWORD_CONSTANTS.UI.SUBTITLE}
        </p>

        {hasToken ? (
          <form onSubmit={handleSubmit} className={cn('flex flex-col gap-3')}>
            <PasswordField
              label={RESET_PASSWORD_CONSTANTS.UI.LABEL_PASSWORD}
              placeholder={RESET_PASSWORD_CONSTANTS.PLACEHOLDERS.PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <PasswordField
              label={RESET_PASSWORD_CONSTANTS.UI.LABEL_CONFIRM}
              placeholder={RESET_PASSWORD_CONSTANTS.PLACEHOLDERS.PASSWORD}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full block text-center text-xs font-bold transition-all transform rounded-xs shadow-2xs bg-brand hover:bg-brand-hover text-white py-1.5 mt-1',
                'active:scale-98 disabled:opacity-60 disabled:pointer-events-none cursor-pointer'
              )}
            >
              {isLoading
                ? RESET_PASSWORD_CONSTANTS.UI.BUTTON_RESETTING
                : RESET_PASSWORD_CONSTANTS.UI.BUTTON_SUBMIT}
            </button>
          </form>
        ) : (
          <p className={cn('text-sm text-text-muted text-center py-4')}>
            {RESET_PASSWORD_CONSTANTS.UI.ERROR_NO_TOKEN}
          </p>
        )}
      </div>
    </div>
  );
}
