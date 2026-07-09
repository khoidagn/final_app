import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useSignUpActions } from '../../hooks/useSignupActions';
import PasswordField from '../../components/ui/PasswordField';
import { SIGNUP_CONSTANTS } from '../../constants/signup.constants';

export default function SignUp() {
  const {
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
    errorMessage,
    successMessage,
    isLoading,
    setEmail,
    setFirstName,
    setLastName,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useSignUpActions();

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased bg-background text-text-primary overflow-hidden'
      )}
    >
      <h1 className={cn('text-3xl font-bold mb-4 tracking-wide text-brand')}>
        {SIGNUP_CONSTANTS.UI.TITLE}
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
          {errorMessage && (
            <div
              className={cn(
                'w-full p-2 mb-3 text-xs text-center text-red-600 bg-red-50 border border-red-200 rounded-xs leading-relaxed'
              )}
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              className={cn(
                'w-full p-2 mb-3 text-xs text-center text-green-600 bg-green-50 border border-green-200 rounded-xs leading-relaxed'
              )}
            >
              {successMessage}
            </div>
          )}

          <div className={cn('w-full flex gap-3 mb-3')}>
            <div className={cn('flex-1')}>
              <label
                className={cn(
                  'block text-xs font-semibold text-text-secondary mb-1'
                )}
              >
                {SIGNUP_CONSTANTS.UI.LABEL_FIRST_NAME}
              </label>
              <input
                type="text"
                placeholder={SIGNUP_CONSTANTS.PLACEHOLDERS.FIRST_NAME}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                className={cn(
                  'w-full bg-surface border rounded-xs px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
                  'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
                )}
              />
            </div>

            <div className={cn('flex-1')}>
              <label
                className={cn(
                  'block text-xs font-semibold text-text-secondary mb-1'
                )}
              >
                {SIGNUP_CONSTANTS.UI.LABEL_LAST_NAME}
              </label>
              <input
                type="text"
                placeholder={SIGNUP_CONSTANTS.PLACEHOLDERS.LAST_NAME}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                className={cn(
                  'w-full bg-surface border rounded-xs px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
                  'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
                )}
              />
            </div>
          </div>

          <div className={cn('w-full mb-3')}>
            <label
              className={cn(
                'block text-xs font-semibold text-text-secondary mb-1'
              )}
            >
              {SIGNUP_CONSTANTS.UI.LABEL_EMAIL}
            </label>
            <input
              type="email"
              placeholder={SIGNUP_CONSTANTS.PLACEHOLDERS.EMAIL}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={cn(
                'w-full bg-surface border rounded-xs px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
                'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
              )}
            />
          </div>

          <div className={cn('w-full mb-3')}>
            <PasswordField
              label={SIGNUP_CONSTANTS.UI.LABEL_PASSWORD}
              placeholder={SIGNUP_CONSTANTS.PLACEHOLDERS.PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              error={!!errorMessage}
            />
          </div>

          <div className={cn('w-full mb-4')}>
            <PasswordField
              label={SIGNUP_CONSTANTS.UI.LABEL_CONFIRM_PASSWORD}
              placeholder={SIGNUP_CONSTANTS.PLACEHOLDERS.PASSWORD}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              error={!!errorMessage}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-24 text-white text-center text-xs font-semibold py-1.5 rounded-xs shadow-2xs transition-all focus:outline-none cursor-pointer',
              'bg-brand hover:bg-brand-hover',
              'active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading
              ? SIGNUP_CONSTANTS.UI.BUTTON_LOADING
              : SIGNUP_CONSTANTS.UI.BUTTON_SUBMIT}
          </button>
        </form>

        <div
          className={cn(
            'p-5 pt-0 border-t flex flex-col gap-2 border-border-muted bg-background/30'
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
              Sign up with Google
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
              Sign up with Facebook
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
              Sign up with Twitter
            </span>
          </button>
        </div>
      </div>

      <div className={cn('text-xs text-text-muted mt-4 font-normal')}>
        {SIGNUP_CONSTANTS.UI.FOOTER_PROMPT}{' '}
        <Link
          to="/login"
          className={cn(
            'text-decoration-none font-semibold text-brand hover:underline inline-block active:scale-98 transform'
          )}
        >
          {SIGNUP_CONSTANTS.UI.LINK_SIGN_IN}
        </Link>
      </div>
    </div>
  );
}
