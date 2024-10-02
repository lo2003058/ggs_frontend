import React from 'react';

const DataTablePaginationButton = ({currentPage, totalPages, onClick, nextPage = false}) => {
  if (!nextPage && currentPage <= 1) return null; // Previous button but current page is the first page
  if (nextPage && (!totalPages || currentPage >= totalPages)) return null; // Next button but current page is the last page

  return (
    <button
      className={`relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0`}
      onClick={onClick}
    >
      {!nextPage ? "Previous" : "Next"}
    </button>
  );
};

export default DataTablePaginationButton;
