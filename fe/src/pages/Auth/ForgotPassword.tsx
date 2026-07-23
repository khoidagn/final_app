import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useForgotPasswordAction } from './hooks/useForgotPasswordAction';
import { FORGOT_PASSWORD_CONSTANTS } from './constants/forgot-password.constant';
import { useAutoRedirectOnSuccess } from '../../hooks/useAutoRedirectOnSuccess';
import { cn } from '../../utils/cn';

export default function ForgotPassword() {
  const {
    email,
    fieldErrors,
    isLoading,
    isSent,
    cooldown,
    handleEmailChange,
    handleSubmit,
    handleResend,
    setIsSent,
  } = useForgotPasswordAction();

  useAutoRedirectOnSuccess('RESET_PASSWORD_SUCCESS');

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center bg-background p-4 font-sans antialiased overflow-hidden'
      )}
    >
      <div
        className={cn(
          'w-full max-w-[380px] bg-surface p-6 rounded-md border border-border-default shadow-xs transition-all'
        )}
      >
        {!isSent ? (
          <>
            <h2
              className={cn(
                'text-xl font-bold text-center mb-1 text-text-primary'
              )}
            >
              {FORGOT_PASSWORD_CONSTANTS.UI.TITLE}
            </h2>
            <p
              className={cn(
                'text-xs text-text-secondary text-center mb-5 leading-relaxed'
              )}
            >
              {FORGOT_PASSWORD_CONSTANTS.UI.SUBTITLE}
            </p>

            <form
              noValidate
              onSubmit={handleSubmit}
              className={cn('flex flex-col gap-3')}
            >
              <div className={cn('w-full')}>
                <label
                  className={cn(
                    'block text-xs font-semibold text-text-secondary mb-1'
                  )}
                >
                  {FORGOT_PASSWORD_CONSTANTS.UI.LABEL_EMAIL}
                </label>
                <input
                  type="email"
                  placeholder={FORGOT_PASSWORD_CONSTANTS.PLACEHOLDERS.EMAIL}
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className={cn(
                    'w-full bg-surface border rounded-xs px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
                    fieldErrors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
                    isLoading && 'opacity-60 cursor-not-allowed'
                  )}
                />
                {fieldErrors.email && (
                  <p
                    className={cn('text-[11px] text-red-500 mt-1 font-medium')}
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full block text-center text-xs font-bold transition-all rounded-xs shadow-2xs bg-brand hover:bg-brand-hover text-white py-2',
                  'active:scale-98 disabled:opacity-60 disabled:pointer-events-none cursor-pointer mt-1'
                )}
              >
                {isLoading
                  ? FORGOT_PASSWORD_CONSTANTS.UI.BUTTON_SENDING
                  : FORGOT_PASSWORD_CONSTANTS.UI.BUTTON_SUBMIT}
              </button>
            </form>
          </>
        ) : (
          <div className={cn('flex flex-col items-center text-center')}>
            {/* Icon Mail sắc nét từ Lucide */}
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-brand/10 text-brand'
              )}
            >
              <Mail className={cn('w-6 h-6 stroke-[2]')} />
            </div>

            <h2 className={cn('text-xl font-bold mb-1 text-text-primary')}>
              {FORGOT_PASSWORD_CONSTANTS.UI.TITLE_SENT}
            </h2>

            <p
              className={cn('text-xs text-text-secondary mb-5 leading-relaxed')}
            >
              We have sent a password reset link to{' '}
              <strong className={cn('text-text-primary font-semibold')}>
                {email || 'your email'}
              </strong>
              .
            </p>

            <div className={cn('text-xs text-text-muted mb-4')}>
              {FORGOT_PASSWORD_CONSTANTS.UI.STATUS_QUESTION}{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading || cooldown > 0}
                className={cn(
                  'font-semibold text-brand bg-transparent border-none p-0 cursor-pointer transition-colors',
                  'hover:underline disabled:text-text-muted disabled:no-underline disabled:cursor-not-allowed'
                )}
              >
                {cooldown > 0
                  ? FORGOT_PASSWORD_CONSTANTS.UI.BUTTON_COOLDOWN(cooldown)
                  : FORGOT_PASSWORD_CONSTANTS.UI.BUTTON_RESEND}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSent?.(false)}
              className={cn(
                'text-xs text-brand hover:underline font-medium cursor-pointer bg-transparent border-none p-0'
              )}
            >
              {FORGOT_PASSWORD_CONSTANTS.UI.TRY_ANOTHER_EMAIL}
            </button>
          </div>
        )}

        <div
          className={cn('mt-5 pt-4 border-t border-border-muted text-center')}
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
            {FORGOT_PASSWORD_CONSTANTS.UI.BACK_TO_LOGIN}
          </Link>
        </div>
      </div>
    </div>
  );
}
