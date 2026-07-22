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
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, currentPage + 1);

      if (currentPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (currentPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        'w-full flex items-center justify-between mt-8 text-xs select-none'
      )}
    >
      <div className={cn('flex-1 flex justify-end pr-1 sm:pr-2')}>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            'px-3 py-1.5 border rounded-sm transition-colors text-xs font-semibold cursor-pointer shrink-0',
            currentPage === 1
              ? 'border-border-default bg-surface text-text-muted cursor-not-allowed opacity-50'
              : 'border-border-default bg-surface text-text-secondary hover:bg-background active:scale-95 transform'
          )}
        >
          Previous
        </button>
      </div>

      <div
        className={cn('flex items-center justify-center space-x-1 shrink-0')}
      >
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className={cn(
                  'px-1.5 sm:px-2 py-1 text-xs text-text-muted select-none font-bold'
                )}
              >
                ...
              </span>
            );
          }

          const pageNumber = Number(page);
          const isCurrent = currentPage === pageNumber;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'px-2.5 sm:px-3 py-1.5 border rounded-sm transition-colors cursor-pointer text-xs font-bold min-w-7 sm:min-w-8 text-center',
                'active:scale-95 transform',
                isCurrent
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-border-default bg-surface text-text-secondary hover:bg-background hover:text-text-primary'
              )}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <div className={cn('flex-1 flex justify-start pl-1 sm:pl-2')}>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            'px-3 py-1.5 border rounded-sm transition-colors text-xs font-semibold cursor-pointer shrink-0',
            currentPage === totalPages
              ? 'border-border-default bg-surface text-text-muted cursor-not-allowed opacity-50'
              : 'border-border-default bg-surface text-brand hover:bg-background active:scale-95 transform'
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
