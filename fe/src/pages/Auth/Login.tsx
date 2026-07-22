import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useLoginAction } from './hooks/useLoginAction';
import PasswordField from '../../components/ui/PasswordField';
import { LOGIN_CONSTANTS } from './constants/login.constant';

export default function Login() {
  const {
    email,
    password,
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
                'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
                isLoading && 'opacity-60 cursor-not-allowed'
              )}
            />
          </div>

          <div className={cn('w-full mb-4')}>
            <PasswordField
              label={LOGIN_CONSTANTS.UI.LABEL_PASSWORD}
              placeholder={LOGIN_CONSTANTS.PLACEHOLDERS.PASSWORD}
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
            />
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

        <div
          className={cn(
            'p-5 pt-3 border-t flex flex-col gap-2 border-border-muted bg-background/30'
          )}
        >
          <button
            disabled={isLoading}
            className={cn(
              'w-full h-8 border rounded-xs flex items-center justify-center space-x-2 shadow-2xs transition-all focus:outline-none px-3 cursor-pointer bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className={cn('w-3.5 h-3.5 shrink-0')}
            />
            <span className={cn('text-xs font-medium')}>
              Sign in with Google
            </span>
          </button>

          <button
            disabled={isLoading}
            className={cn(
              'w-full h-8 border rounded-xs flex items-center justify-center space-x-2 shadow-2xs transition-all focus:outline-none px-3 cursor-pointer bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className={cn('w-3.5 h-3.5 shrink-0')}
            />
            <span className={cn('text-xs font-medium')}>
              Sign in with Facebook
            </span>
          </button>

          <button
            disabled={isLoading}
            className={cn(
              'w-full h-8 border rounded-xs flex items-center justify-center space-x-2 shadow-2xs transition-all focus:outline-none px-3 cursor-pointer bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475689/twitter-color.svg"
              alt="Twitter"
              className={cn('w-3.5 h-3.5 shrink-0')}
            />
            <span className={cn('text-xs font-medium')}>
              Sign in with Twitter
            </span>
          </button>
        </div>
      </div>

      <div className={cn('text-xs text-text-muted mt-4 font-normal')}>
        {LOGIN_CONSTANTS.UI.FOOTER_PROMPT}
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
