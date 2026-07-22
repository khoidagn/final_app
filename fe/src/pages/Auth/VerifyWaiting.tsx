import { useVerifyWaitingAction } from './hooks/useVerifyWaitingAction';
import { VERIFY_WAITING_CONSTANTS } from './constants/verify-waiting.constant';
import { cn } from '../../utils/cn';

export default function VerifyWaiting() {
  const {
    userEmail,
    isConfirmedSuccess,
    resendLoading,
    cooldown,
    handleResend,
  } = useVerifyWaitingAction();

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center font-sans antialiased overflow-hidden'
      )}
    >
      <div
        className={cn(
          'w-full max-w-[440px] bg-surface p-5 rounded-md border border-border-default shadow-xs flex flex-col items-center'
        )}
      >
        <div
          className={cn(
            'w-12 h-12 text-xl rounded-full flex items-center justify-center mb-4',
            isConfirmedSuccess
              ? 'bg-green-100 text-green-600'
              : 'bg-brand/10 text-brand animate-bounce'
          )}
        >
          {isConfirmedSuccess ? '🎉' : '📩'}
        </div>

        <h2 className={cn('text-xl font-bold mb-1 text-text-primary')}>
          {isConfirmedSuccess
            ? VERIFY_WAITING_CONSTANTS.UI.TITLE_SUCCESS
            : VERIFY_WAITING_CONSTANTS.UI.TITLE_PENDING}
        </h2>

        <p className={cn('text-xs text-text-secondary mb-5 leading-relaxed')}>
          {isConfirmedSuccess
            ? VERIFY_WAITING_CONSTANTS.UI.DESC_SUCCESS
            : VERIFY_WAITING_CONSTANTS.UI.DESC_PENDING(userEmail)}
        </p>

        {!isConfirmedSuccess && (
          <div className={cn('w-full flex flex-col items-center gap-3')}>
            <div
              className={cn(
                'flex items-center gap-2 text-xs text-brand font-medium'
              )}
            >
              <div
                className={cn(
                  'w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin'
                )}
              />
              {VERIFY_WAITING_CONSTANTS.UI.STATUS_WAITING}
            </div>

            <div className={cn('text-xs text-text-muted mt-1')}>
              {VERIFY_WAITING_CONSTANTS.UI.STATUS_QUESTION}{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || cooldown > 0}
                className={cn(
                  'font-semibold text-brand hover:underline bg-transparent border-none p-0 cursor-pointer disabled:text-text-muted transition-colors'
                )}
              >
                {cooldown > 0
                  ? VERIFY_WAITING_CONSTANTS.UI.BUTTON_COOLDOWN(cooldown)
                  : resendLoading
                    ? VERIFY_WAITING_CONSTANTS.UI.BUTTON_SENDING
                    : VERIFY_WAITING_CONSTANTS.UI.BUTTON_RESEND}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
