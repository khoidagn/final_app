import React, { type FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface BaseFormLayoutProps {
  title: string;
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export default function BaseFormLayout({
  title,
  isEdit,
  onSubmit,
  onDelete,
  children,
}: BaseFormLayoutProps) {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 w-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <Link
          to="/my-profile"
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs text-decoration-none transition-colors"
        >
          Back
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full"
      >
        {children}

        <div className="md:col-span-2 flex items-center gap-3 pt-4 border-t border-gray-50 mt-4">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer focus:outline-none"
          >
            Save
          </button>

          {isEdit && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer focus:outline-none flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
