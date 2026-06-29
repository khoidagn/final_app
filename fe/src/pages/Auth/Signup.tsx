import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export default function SignUp() {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased',
        'bg-background text-text-primary'
      )}
    >
      <h1 className={cn('text-3xl font-bold mb-6 tracking-wide text-brand')}>
        Fotobook Sign Up
      </h1>

      <div
        className={cn(
          'w-full max-w-[400px] overflow-hidden',
          'bg-surface rounded-md shadow-xs border border-border-default'
        )}
      >
        <div className={cn('p-6 flex flex-col items-center')}>
          <div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center mb-6 border',
              'bg-background border-border-muted'
            )}
          >
            <svg
              className={cn('w-10 h-10 text-text-muted')}
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

          <div className={cn('w-full mb-4')}>
            <input
              type="email"
              placeholder="Email"
              className={cn(
                'w-full bg-surface border rounded-xs px-3 py-2 text-sm focus:outline-none placeholder-text-muted text-text-primary transition-all',
                'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
              )}
            />
          </div>

          <div className={cn('w-full mb-4')}>
            <input
              type="text"
              placeholder="Username"
              className={cn(
                'w-full bg-surface border rounded-xs px-3 py-2 text-sm focus:outline-none placeholder-text-muted text-text-primary transition-all',
                'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
              )}
            />
          </div>

          <div className={cn('w-full mb-4')}>
            <input
              type="password"
              placeholder="Password"
              className={cn(
                'w-full bg-surface border rounded-xs px-3 py-2 text-sm focus:outline-none placeholder-text-muted text-text-primary transition-all',
                'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
              )}
            />
          </div>

          <div className={cn('w-full mb-6')}>
            <input
              type="password"
              placeholder="Password Confirmation"
              className={cn(
                'w-full bg-surface border rounded-xs px-3 py-2 text-sm focus:outline-none placeholder-text-muted text-text-primary transition-all',
                'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20'
              )}
            />
          </div>

          <button
            type="submit"
            className={cn(
              'w-24 text-white text-center text-sm font-semibold py-2 rounded-xs shadow-2xs transition-all focus:outline-none cursor-pointer',
              'bg-brand hover:bg-brand-hover',
              'active:scale-95 transform'
            )}
          >
            Sign Up
          </button>
        </div>

        <div
          className={cn(
            'p-6 flex flex-col gap-3 border-t',
            'border-border-muted bg-background/30'
          )}
        >
          <button
            className={cn(
              'w-full h-11 border rounded-xs flex items-center justify-center space-x-3 shadow-2xs transition-all focus:outline-none px-4 cursor-pointer',
              'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary',
              'active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className={cn('w-5 h-5 shrink-0')}
            />
            <span className={cn('text-sm font-medium')}>
              Sign in with Google
            </span>
          </button>

          <button
            className={cn(
              'w-full h-11 border rounded-xs flex items-center justify-center space-x-3 shadow-2xs transition-all focus:outline-none px-4 cursor-pointer',
              'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary',
              'active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className={cn('w-5 h-5 shrink-0')}
            />
            <span className={cn('text-sm font-medium')}>
              Sign in with Facebook
            </span>
          </button>

          <button
            className={cn(
              'w-full h-11 border rounded-xs flex items-center justify-center space-x-3 shadow-2xs transition-all focus:outline-none px-4 cursor-pointer',
              'bg-surface border-border-default text-text-secondary hover:bg-background hover:text-text-primary',
              'active:scale-98 transform'
            )}
          >
            <img
              src="https://www.svgrepo.com/show/475689/twitter-color.svg"
              alt="Twitter"
              className={cn('w-5 h-5 shrink-0')}
            />
            <span className={cn('text-sm font-medium')}>
              Sign in with Twitter
            </span>
          </button>
        </div>
      </div>

      <div className={cn('text-sm text-text-muted mt-5 font-normal')}>
        Already have an account?{' '}
        <Link
          to="/login"
          className={cn(
            'text-decoration-none font-semibold text-brand hover:underline',
            'active:scale-98 transform inline-block'
          )}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
