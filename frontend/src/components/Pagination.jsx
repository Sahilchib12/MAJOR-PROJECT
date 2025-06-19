import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
  showFirstLast = true,
  size = "md",
  variant = "default",
  disabled = false,
  ...props
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // +2 for the "..." blocks

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );

      return [1, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );

      return [1, "...", ...middleRange, "...", totalPages];
    }
  };

  // Size styles
  const sizeStyles = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  // Variant styles
  const variantStyles = {
    default: {
      container: "flex items-center justify-center space-x-2",
      button:
        "flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      active: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
      disabled: "opacity-50 cursor-not-allowed pointer-events-none",
    },
    rounded: {
      container: "flex items-center justify-center space-x-2",
      button:
        "flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      active: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
      disabled: "opacity-50 cursor-not-allowed pointer-events-none",
    },
    simple: {
      container: "flex items-center justify-center space-x-4",
      button:
        "flex items-center justify-center text-gray-700 hover:text-blue-600",
      active: "text-blue-600 font-medium",
      disabled: "opacity-50 cursor-not-allowed pointer-events-none",
    },
  };

  // Get the selected variant styles
  const selectedVariant = variantStyles[variant];

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== "..." && page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  // Handle first page
  const handleFirst = () => {
    if (currentPage !== 1 && !disabled) {
      onPageChange(1);
    }
  };

  // Handle last page
  const handleLast = () => {
    if (currentPage !== totalPages && !disabled) {
      onPageChange(totalPages);
    }
  };

  // Get page numbers
  const pageNumbers = getPageNumbers();

  return (
    <nav className={`${selectedVariant.container} ${className}`} {...props}>
      {/* Previous button */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1 || disabled}
        className={`${sizeStyles[size]} ${selectedVariant.button} ${
          currentPage === 1 || disabled ? selectedVariant.disabled : ""
        }`}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* First page button */}
      {showFirstLast && currentPage > 3 && (
        <>
          <button
            type="button"
            onClick={handleFirst}
            disabled={disabled}
            className={`${sizeStyles[size]} ${selectedVariant.button} ${
              disabled ? selectedVariant.disabled : ""
            }`}
            aria-label="First page"
          >
            1
          </button>

          {currentPage > 4 && <span className="text-gray-500">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers?.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="text-gray-500">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            className={`${sizeStyles[size]} ${selectedVariant.button} ${
              page === currentPage ? selectedVariant.active : ""
            } ${disabled ? selectedVariant.disabled : ""}`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className="text-gray-500">...</span>
          )}

          <button
            type="button"
            onClick={handleLast}
            disabled={disabled}
            className={`${sizeStyles[size]} ${selectedVariant.button} ${
              disabled ? selectedVariant.disabled : ""
            }`}
            aria-label="Last page"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
        className={`${sizeStyles[size]} ${selectedVariant.button} ${
          currentPage === totalPages || disabled ? selectedVariant.disabled : ""
        }`}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default Pagination;
