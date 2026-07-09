import { Link } from 'react-router-dom';
import { useForgotPasswordActions } from '../../hooks/useForgotPasswordActions';
import { FORGOT_PASSWORD_CONSTANTS } from '../../constants/forgot-password.constants';
import { cn } from '../../utils/cn';

export default function ForgotPassword() {
  const { email, setEmail, isLoading, cooldown, feedback, handleSubmit } =
    useForgotPasswordActions();

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
          {FORGOT_PASSWORD_CONSTANTS.UI.TITLE}
        </h2>
        <p
          className={cn(
            'text-xs text-text-secondary text-center mb-5 leading-relaxed'
          )}
        >
          {FORGOT_PASSWORD_CONSTANTS.UI.SUBTITLE}
        </p>

        {feedback && (
          <div
            className={cn(
              'w-full p-2 mb-3 text-xs border rounded-xs leading-relaxed text-center',
              feedback.type === 'success'
                ? 'text-green-600 bg-green-50 border-green-200'
                : 'text-red-600 bg-red-50 border-red-200'
            )}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={cn('flex flex-col gap-3')}>
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
              required
              placeholder={FORGOT_PASSWORD_CONSTANTS.PLACEHOLDERS.EMAIL}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || cooldown > 0}
              className={cn(
                'w-full bg-surface border rounded-xs px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
                'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60'
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || cooldown > 0}
            className={cn(
              'w-full block text-center text-decoration-none text-xs font-bold transition-all transform rounded-xs shadow-2xs bg-brand hover:bg-brand-hover text-white py-1.5',
              'active:scale-98 disabled:opacity-60 disabled:pointer-events-none'
            )}
          >
            {cooldown > 0
              ? FORGOT_PASSWORD_CONSTANTS.UI.BUTTON_COOLDOWN(cooldown)
              : isLoading
                ? FORGOT_PASSWORD_CONSTANTS.UI.BUTTON_SENDING
                : FORGOT_PASSWORD_CONSTANTS.UI.BUTTON_SUBMIT}
          </button>
        </form>

        <div className={cn('mt-4 text-center')}>
          <Link
            to="/login"
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline text-decoration-none transition-colors group'
            )}
          >
            <svg
              className={cn(
                'w-3.5 h-3.5 transform transition-transform group-hover:-translate-x-0.5'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {FORGOT_PASSWORD_CONSTANTS.UI.BACK_TO_LOGIN}
          </Link>
        </div>
      </div>
    </div>
  );
}
