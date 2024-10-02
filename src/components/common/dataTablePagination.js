import React from "react";
import DataTablePaginationButton from "./dataTablePaginationButton";

const DataTablePagination = ({
                            currentPage,
                            firstItemIndex,
                            lastItemIndex,
                            totalResults,
                            pageSize,
                            onPrevPageClick,
                            onNextPageClick,
                          }) => {
  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <nav
      className="flex items-center justify-between bg-white px-4 pt-6 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing
          <span className="font-medium">{` ${firstItemIndex} `}</span> to
          <span className="font-medium">{` ${lastItemIndex} `}</span> of
          <span className="font-medium">{` ${totalResults} `}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between gap-3 sm:justify-end">
        <DataTablePaginationButton currentPage={currentPage} onClick={onPrevPageClick} />
        <DataTablePaginationButton currentPage={currentPage} totalPages={totalPages} onClick={onNextPageClick} nextPage />
      </div>
    </nav>
  );
};

export default DataTablePagination;
