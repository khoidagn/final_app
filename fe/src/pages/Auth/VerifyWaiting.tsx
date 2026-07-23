import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Info } from 'lucide-react';
import { useVerifyWaitingAction } from './hooks/useVerifyWaitingAction';
import { VERIFY_WAITING_CONSTANTS } from './constants/verify-waiting.constant';
import { useAutoRedirectOnSuccess } from '../../hooks/useAutoRedirectOnSuccess';
import { cn } from '../../utils/cn';

export default function VerifyWaiting() {
  const { userEmail, resendLoading, cooldown, handleResend } =
    useVerifyWaitingAction();

  useAutoRedirectOnSuccess('VERIFY_SUCCESS');

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased overflow-hidden bg-background'
      )}
    >
      <div
        className={cn(
          'w-full max-w-[380px] bg-surface p-6 rounded-md border border-border-default shadow-xs flex flex-col items-center text-center transition-all'
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-brand/10 text-brand'
          )}
        >
          <Mail className={cn('w-6 h-6 stroke-[2]')} />
        </div>

        <h2 className={cn('text-xl font-bold mb-1 text-text-primary')}>
          {VERIFY_WAITING_CONSTANTS.UI.TITLE_PENDING}
        </h2>

        <p className={cn('text-xs text-text-secondary mb-5 leading-relaxed')}>
          We have sent a verification link to{' '}
          <strong className={cn('text-text-primary font-semibold')}>
            {userEmail || 'your email'}
          </strong>
          . Please check your inbox to activate your account.
        </p>

        <div className={cn('w-full text-xs text-text-muted mb-4')}>
          {VERIFY_WAITING_CONSTANTS.UI.STATUS_QUESTION}{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || cooldown > 0}
            className={cn(
              'font-semibold text-brand bg-transparent border-none p-0 cursor-pointer transition-colors',
              'hover:underline disabled:text-text-muted disabled:no-underline disabled:cursor-not-allowed'
            )}
          >
            {cooldown > 0
              ? VERIFY_WAITING_CONSTANTS.UI.BUTTON_COOLDOWN(cooldown)
              : resendLoading
                ? VERIFY_WAITING_CONSTANTS.UI.BUTTON_SENDING
                : VERIFY_WAITING_CONSTANTS.UI.BUTTON_RESEND}
          </button>
        </div>

        <div
          className={cn(
            'w-full flex items-center justify-center gap-1.5 text-[11px] text-text-muted bg-background px-3 py-2 rounded-xs border border-border-muted mb-2'
          )}
        >
          <Info className={cn('w-3.5 h-3.5 shrink-0 text-brand/80')} />
          <span>{VERIFY_WAITING_CONSTANTS.UI.NOTE_CLOSE_TAB}</span>
        </div>

        <div
          className={cn(
            'w-full mt-4 pt-4 border-t border-border-muted text-center'
          )}
        >
          <Link
            to="/login"
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline transition-colors group'
            )}
          >
            <ArrowLeft
              className={cn(
                'w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5'
              )}
            />
            {VERIFY_WAITING_CONSTANTS.UI.BACK_TO_LOGIN}
          </Link>
        </div>
      </div>
    </div>
  );
}
