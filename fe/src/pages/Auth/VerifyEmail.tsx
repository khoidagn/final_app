import { CheckCircle2, XCircle } from 'lucide-react';
import { useVerifyEmailAction } from './hooks/useVerifyEmailAction';
import { VERIFY_EMAIL_CONSTANTS } from './constants/verify-email.constant';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { cn } from '../../utils/cn';

export default function VerifyEmail() {
  const { status, message, navigate } = useVerifyEmailAction();

  if (status === 'loading') {
    return (
      <LoadingSpinner
        text={VERIFY_EMAIL_CONSTANTS.UI.LOADING_TEXT}
        minHeight="min-h-screen"
      />
    );
  }
  const isSuccess = status === 'success';
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
            'w-12 h-12 rounded-full flex items-center justify-center mb-3',
            isSuccess
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
              : 'bg-destructive/10 text-destructive'
          )}
        >
          {isSuccess ? (
            <CheckCircle2 className={cn('w-6 h-6 stroke-[2]')} />
          ) : (
            <XCircle className={cn('w-6 h-6 stroke-[2]')} />
          )}
        </div>

        <h2 className={cn('text-xl font-bold mb-1 text-text-primary')}>
          {isSuccess
            ? VERIFY_EMAIL_CONSTANTS.UI.TITLE_SUCCESS
            : VERIFY_EMAIL_CONSTANTS.UI.TITLE_FAILED}
        </h2>

        <p className={cn('text-xs text-text-secondary mb-6 leading-relaxed')}>
          {message ||
            (isSuccess
              ? VERIFY_EMAIL_CONSTANTS.API_RESPONSE.DEFAULT_SUCCESS
              : VERIFY_EMAIL_CONSTANTS.API_RESPONSE.DEFAULT_FAILED)}
        </p>

        <button
          type="button"
          onClick={() => navigate(isSuccess ? '/login' : '/signup')}
          className={cn(
            'w-full block text-center text-xs font-bold transition-all rounded-xs shadow-2xs bg-brand hover:bg-brand-hover text-white py-2',
            'active:scale-98 cursor-pointer'
          )}
        >
          {isSuccess
            ? VERIFY_EMAIL_CONSTANTS.UI.BUTTON_SUCCESS
            : VERIFY_EMAIL_CONSTANTS.UI.BUTTON_FAILED}
        </button>
      </div>
    </div>
  );
}
