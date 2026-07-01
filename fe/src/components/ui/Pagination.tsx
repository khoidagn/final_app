import React from 'react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div
      className={cn(
        'flex justify-center items-center space-x-1 mt-8 text-xs select-none',
        'max-sm:gap-1 max-sm:space-x-0'
      )}
    >
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          'px-3 py-1.5 border rounded-sm transition-colors text-sm font-medium',
          currentPage === 1
            ? 'border-border-default bg-surface text-text-muted cursor-not-allowed'
            : 'border-border-default bg-surface text-text-secondary hover:bg-background cursor-pointer active:scale-95 transform'
        )}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              'px-3 py-1.5 border rounded-sm transition-colors cursor-pointer text-sm font-medium',
              'active:scale-95 transform',
              currentPage === pageNumber
                ? 'border-brand bg-brand/5 text-brand font-bold'
                : 'border-border-default bg-surface text-text-secondary hover:bg-background'
            )}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          'px-3 py-1.5 border rounded-sm transition-colors text-sm font-medium',
          currentPage === totalPages
            ? 'border-border-default bg-surface text-text-muted cursor-not-allowed'
            : 'border-border-default bg-surface text-brand hover:bg-background cursor-pointer active:scale-95 transform'
        )}
      >
        Next
      </button>
    </div>
  );
}
