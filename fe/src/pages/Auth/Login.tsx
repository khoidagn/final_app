import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useLoginAction } from './hooks/useLoginAction';
import PasswordField from '../../components/ui/PasswordField';
import SocialAuthButtons from './components/SocialAuthButtons';
import { LOGIN_CONSTANTS } from './constants/login.constant';

export default function Login() {
  const {
    email,
    password,
    fieldErrors,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useLoginAction();

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased bg-background text-text-primary overflow-hidden'
      )}
    >
      <h1 className={cn('text-3xl font-bold mb-4 tracking-wide text-brand')}>
        {LOGIN_CONSTANTS.UI.TITLE}
      </h1>

      <div
        className={cn(
          'w-full max-w-[360px] overflow-hidden bg-surface rounded-md shadow-xs border border-border-default'
        )}
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          className={cn('p-5 flex flex-col items-center')}
        >
          <div className={cn('w-full mb-3')}>
            <label
              className={cn(
                'block text-xs font-semibold text-text-secondary mb-1'
              )}
            >
              {LOGIN_CONSTANTS.UI.LABEL_EMAIL}
            </label>
            <input
              type="email"
              placeholder={LOGIN_CONSTANTS.PLACEHOLDERS.EMAIL}
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
              <p className={cn('text-[11px] text-red-500 mt-1 font-medium')}>
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className={cn('w-full mb-4')}>
            <PasswordField
              label={LOGIN_CONSTANTS.UI.LABEL_PASSWORD}
              placeholder={LOGIN_CONSTANTS.PLACEHOLDERS.PASSWORD}
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              className={cn(
                fieldErrors.password &&
                  'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              )}
            />
            {fieldErrors.password && (
              <p className={cn('text-[11px] text-red-500 mt-1 font-medium')}>
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-24 text-white text-center text-xs font-semibold py-1.5 rounded-xs shadow-2xs transition-all focus:outline-none cursor-pointer mb-3',
              'bg-brand hover:bg-brand-hover',
              'active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading
              ? LOGIN_CONSTANTS.UI.BUTTON_LOADING
              : LOGIN_CONSTANTS.UI.BUTTON_SUBMIT}
          </button>

          <div className={cn('text-center')}>
            <Link
              to="/forgot-password"
              className={cn(
                'text-xs font-semibold text-brand hover:underline text-decoration-none transition-colors'
              )}
            >
              {LOGIN_CONSTANTS.UI.LINK_FORGOT_PASSWORD}
            </Link>
          </div>
        </form>

        <SocialAuthButtons isLoading={isLoading} mode="signin" />
      </div>

      <div className={cn('text-xs text-text-muted mt-4 font-normal')}>
        {LOGIN_CONSTANTS.UI.FOOTER_PROMPT}{' '}
        <Link
          to="/signup"
          className={cn(
            'text-decoration-none font-semibold text-brand hover:underline inline-block active:scale-98 transform'
          )}
        >
          {LOGIN_CONSTANTS.UI.LINK_SIGN_UP}
        </Link>
      </div>
    </div>
  );
}
