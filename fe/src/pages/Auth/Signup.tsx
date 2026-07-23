import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useSignUpAction } from './hooks/useSignupAction';
import PasswordField from '../../components/ui/PasswordField';
import SocialAuthButtons from './components/SocialAuthButtons';
import { SIGNUP_CONSTANTS } from './constants/signup.constant';

export default function SignUp() {
  const {
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
    fieldErrors,
    isLoading,
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  } = useSignUpAction();

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
          noValidate
          onSubmit={handleSubmit}
          className={cn('p-5 flex flex-col items-center')}
        >
          {/* FIRST NAME & LAST NAME */}
          <div className={cn('w-full flex gap-3 mb-3 items-start')}>
            {/* FIRST NAME */}
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
                onChange={handleFirstNameChange}
                disabled={isLoading}
                className={cn(
                  'w-full bg-surface border rounded-xs px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
                  fieldErrors.firstName
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
                  isLoading && 'opacity-60 cursor-not-allowed'
                )}
              />
              {fieldErrors.firstName && (
                <p className={cn('text-[11px] text-red-500 mt-1 font-medium')}>
                  {fieldErrors.firstName}
                </p>
              )}
            </div>

            {/* LAST NAME */}
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
                onChange={handleLastNameChange}
                disabled={isLoading}
                className={cn(
                  'w-full bg-surface border rounded-xs px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
                  fieldErrors.lastName
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
                  isLoading && 'opacity-60 cursor-not-allowed'
                )}
              />
              {fieldErrors.lastName && (
                <p className={cn('text-[11px] text-red-500 mt-1 font-medium')}>
                  {fieldErrors.lastName}
                </p>
              )}
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

          <div className={cn('w-full mb-3')}>
            <PasswordField
              label={SIGNUP_CONSTANTS.UI.LABEL_PASSWORD}
              placeholder={SIGNUP_CONSTANTS.PLACEHOLDERS.PASSWORD}
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

          <div className={cn('w-full mb-4')}>
            <PasswordField
              label={SIGNUP_CONSTANTS.UI.LABEL_CONFIRM_PASSWORD}
              placeholder={SIGNUP_CONSTANTS.PLACEHOLDERS.PASSWORD}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={isLoading}
              className={cn(
                fieldErrors.confirmPassword &&
                  'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              )}
            />
            {fieldErrors.confirmPassword && (
              <p className={cn('text-[11px] text-red-500 mt-1 font-medium')}>
                {fieldErrors.confirmPassword}
              </p>
            )}
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

        <SocialAuthButtons isLoading={isLoading} mode="signup" />
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
