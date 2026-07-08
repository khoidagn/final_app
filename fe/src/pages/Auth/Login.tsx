import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useLoginActions } from '../../hooks/useLoginActions';

export default function Login() {
  // Tiêu thụ toàn bộ logic nghiệp vụ từ Custom Hook
  const {
    email,
    password,
    errorMessage,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useLoginActions();

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased',
        'bg-background text-text-primary'
      )}
    >
      <h1 className={cn('text-2xl font-bold mb-5 tracking-wide text-brand')}>
        Fotobook Login
      </h1>

      <div
        className={cn(
          'w-full max-w-sm overflow-hidden',
          'bg-surface rounded-md shadow-xs border border-border-default'
        )}
      >
        {/* Bọc toàn bộ các trường nhập liệu bằng thẻ form thực tế để bắt sự kiện Enter/Submit */}
        <form
          onSubmit={handleSubmit}
          className={cn('p-5 flex flex-col items-center')}
        >
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center mb-5 border',
              'bg-background border-border-muted'
            )}
          >
            <svg
              className={cn('w-8 h-8 text-text-muted')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          {/* Hiển thị thông báo lỗi trực quan nếu có */}
          {errorMessage && (
            <div
              className={cn(
                'w-full mb-3 p-2 text-center text-xs font-medium text-red-600 bg-red-50 rounded-xs border border-red-200'
              )}
            >
              {errorMessage}
            </div>
          )}

          <div className={cn('w-full mb-3.5')}>
            <input
              type="email"
              placeholder="Email"
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

          <div className={cn('w-full mb-5')}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              className={cn(
                'w-full bg-surface border rounded-xs px-3 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
                'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
                isLoading && 'opacity-60 cursor-not-allowed'
              )}
            />
          </div>

          {/* Thay thế thẻ <Link> thành thẻ <button type="submit"> thực thụ */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'block w-24 mb-3.5 py-1.5 text-center rounded-xs cursor-pointer border-none',
              'text-xs font-semibold text-white bg-brand hover:bg-brand-hover',
              'shadow-2xs transition-all transform active:scale-95',
              isLoading && 'opacity-60 cursor-not-allowed active:scale-100'
            )}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>

          <Link
            to="#"
            className={cn(
              'text-[11px] text-decoration-none font-medium text-brand hover:underline',
              'active:scale-98 transform inline-block'
            )}
          >
            Forgot password?
          </Link>
        </form>

        <div
          className={cn(
            'p-5 pt-0 border-t flex flex-col gap-2.5',
            'border-border-muted bg-background/30'
          )}
        >
          <button
            disabled={isLoading}
            className={cn(
              'w-full h-9 border rounded-xs flex items-center justify-center space-x-3 shadow-2xs transition-all focus:outline-none px-4 cursor-pointer',
              'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary',
              'active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className={cn('w-4 h-4 shrink-0')}
            />
            <span className={cn('text-xs font-medium')}>
              Sign in with Google
            </span>
          </button>

          <button
            disabled={isLoading}
            className={cn(
              'w-full h-9 border rounded-xs flex items-center justify-center space-x-3 shadow-2xs transition-all focus:outline-none px-4 cursor-pointer',
              'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary',
              'active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className={cn('w-4 h-4 shrink-0')}
            />
            <span className={cn('text-xs font-medium')}>
              Sign in with Facebook
            </span>
          </button>

          <button
            disabled={isLoading}
            className={cn(
              'w-full h-9 border rounded-xs flex items-center justify-center space-x-3 shadow-2xs transition-all focus:outline-none px-4 cursor-pointer',
              'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary',
              'active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475689/twitter-color.svg"
              alt="Twitter"
              className={cn('w-4 h-4 shrink-0')}
            />
            <span className={cn('text-xs font-medium')}>
              Sign in with Twitter
            </span>
          </button>
        </div>
      </div>

      <div className={cn('text-xs text-text-muted mt-4 font-normal')}>
        Don't have an account?{' '}
        <Link
          to="/signup"
          className={cn(
            'text-decoration-none font-semibold text-brand hover:underline',
            'active:scale-98 transform inline-block'
          )}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
