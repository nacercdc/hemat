"use client";

import type { Table, PaginationState } from "@tanstack/react-table";
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
import { cn } from "../../shadcn-ui/utils/cn";

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
    <div className="flex flex-col overflow-x-auto min-[400px]:overflow-hidden min-[400px]:flex-row items-center justify-between bg-tbaccent px-8 min-[400px]:px-2 rounded-md">
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              disabled={currentPage <= 1 || disabled}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="text-sm font-bold">Prev</span>
            </Button>
          </PaginationItem>

          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis-left" || page === "ellipsis-right") {
              return (
                <PaginationItem
                  key={`${page}-${index}`}
                  className="px-0 mx-0  w-fit"
                >
                  <PaginationEllipsis className="px-0 mx-0 items-end w-fit" />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  disabled={disabled}
                  onClick={() => handlePageChange(page as number)}
                  className={cn("h-6 w-6 rounded-[2px] p-0 ", {
                    "bg-card": page !== currentPage,
                    "bg-primary text-bold text-card": page === currentPage,
                  })}
                >
                  <span className="text-xs p-0">{page}</span>
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
              <span className="text-sm font-bold">Next</span>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="flex items-center gap-4">
        <Select
          value={pageSize.toString()}
          onValueChange={(value: string) => handlePageSizeChange(Number(value))}
          disabled={disabled}
        >
          <SelectTrigger className="h-6 w-fit">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {`${size} / page`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs font-bold text-nowrap">{`1-${pageSize < totalItems ? pageSize : totalItems} of ${totalItems}`}</p>
      </div>
    </div>
  );
}
