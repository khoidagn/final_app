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
    <div className="flex justify-center items-center space-x-1 mt-8 text-xs select-none">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-1 border rounded-sm transition-colors ${
          currentPage === 1
            ? 'border-gray-200 bg-white text-gray-400 cursor-not-allowed'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer'
        }`}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-1 border rounded-sm transition-colors cursor-pointer ${
              currentPage === pageNumber
                ? 'border-blue-900 bg-blue-50 text-blue-900 font-semibold'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-1 border rounded-sm transition-colors ${
          currentPage === totalPages
            ? 'border-gray-200 bg-white text-gray-400 cursor-not-allowed'
            : 'border-gray-200 bg-white text-blue-600 hover:bg-gray-50 cursor-pointer'
        }`}
      >
        Next
      </button>
    </div>
  );
}
