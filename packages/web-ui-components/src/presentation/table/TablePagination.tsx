"use client";

import type { Table, PaginationState } from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "../../shadcn-ui/pagination";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn-ui";

interface ManualPaginationProps<TData> {
  table: Table<TData>;
  totalItems?: number;
  disabled?: boolean;
  pageSizeOptions?: number[];
  onPaginationChange?: (pagination: PaginationState) => void;
}

export function TablePagination<TData>({
  table,
  totalItems = 0,
  onPaginationChange,
  disabled = false,
  pageSizeOptions = [10, 20, 30, 50, 100],
}: ManualPaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const newPagination = {
      pageIndex: newPage - 1,
      pageSize: pageSize,
    };

    table.setPagination(newPagination);
    onPaginationChange?.(newPagination);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newPagination = {
      pageIndex: 0,
      pageSize: newPageSize,
    };

    table.setPagination(newPagination);
    onPaginationChange?.(newPagination);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("ellipsis-left");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("ellipsis-right");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between bg-tbaccent py-4 px-2 my-3 rounded-md">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value: string) => handlePageSizeChange(Number(value))}
          disabled={disabled}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              disabled={currentPage <= 1 || disabled}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <Icon icon="lucide:chevron-left" /> Previous
            </Button>
          </PaginationItem>

          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis-left" || page === "ellipsis-right") {
              return (
                <PaginationItem key={`${page}-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <Button
                  variant={page === currentPage ? "outline" : "ghost"}
                  disabled={disabled}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </Button>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <Button
              variant="ghost"
              disabled={currentPage >= totalPages || disabled}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <Icon icon="lucide:chevron-right" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
