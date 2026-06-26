import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans antialiased text-gray-800">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 tracking-wide">
        Fotobook Login
      </h1>

      <div className="w-full max-w-md bg-white rounded-md shadow-xs border border-gray-200 overflow-hidden">
        <div className="p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-6 border border-gray-100">
            <svg
              className="w-10 h-10 text-gray-400"
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

          <div className="w-full mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white border border-gray-300 rounded-xs px-3 py-2 text-sm focus:outline-none focus:border-blue-900 placeholder-gray-400"
            />
          </div>

          <div className="w-full mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white border border-gray-300 rounded-xs px-3 py-2 text-sm focus:outline-none focus:border-blue-900 placeholder-gray-400"
            />
          </div>

          <Link
            to="/feeds"
            className="w-24 bg-blue-900 hover:bg-blue-900 text-white text-center text-sm font-semibold py-2 rounded-xs shadow-2xs text-decoration-none transition-colors block mb-4"
          >
            Login
          </Link>

          <Link
            to="#"
            className="text-xs text-blue-900 hover:underline text-decoration-none font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <div className="p-6 pt-0 border-b border-gray-100 flex flex-col gap-3 bg-gray-50/50">
          <button className="w-full h-11 bg-white border border-gray-200 rounded-xs flex items-center justify-center space-x-3 shadow-2xs hover:bg-gray-50 transition-colors focus:outline-none px-4">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 shrink-0"
            />
            <span className="text-sm font-medium text-gray-700">
              Sign in with Google
            </span>
          </button>

          <button className="w-full h-11 bg-white border border-gray-200 rounded-xs flex items-center justify-center space-x-3 shadow-2xs hover:bg-gray-50 transition-colors focus:outline-none px-4">
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="w-5 h-5 shrink-0"
            />
            <span className="text-sm font-medium text-gray-700">
              Sign in with Facebook
            </span>
          </button>

          {/* Nút Twitter */}
          <button className="w-full h-11 bg-white border border-gray-200 rounded-xs flex items-center justify-center space-x-3 shadow-2xs hover:bg-gray-50 transition-colors focus:outline-none px-4">
            <img
              src="https://www.svgrepo.com/show/475689/twitter-color.svg"
              alt="Twitter"
              className="w-5 h-5 shrink-0"
            />
            <span className="text-sm font-medium text-gray-700">
              Sign in with Twitter
            </span>
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-5 font-normal">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-blue-900 hover:underline text-decoration-none font-semibold"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
