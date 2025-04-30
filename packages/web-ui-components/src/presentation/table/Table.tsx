"use client";

import React, { useCallback, useRef, useState } from "react";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { cn } from "../../shadcn-ui/utils/cn";
import { Icon } from "@iconify/react";
import { Input } from "../../forms";
import { TablePagination } from "./TablePagination";
import { Skeleton } from "../../shadcn-ui";

interface FilterOptionsType {
  value: string;
  label: string;
}
interface Props<TData> {
  collectionName: string;
  columns: ColumnDef<TData>[];
  data?: TData[];
  toolbar?: React.ReactNode;
  totalItems: number;
  isLoading: boolean;
  showFilterFields?: boolean;
  pageSizeOptions?: number[];
  initialPagination?: PaginationState;
  enableRowSelection?: boolean;
  onEmptyDataElement?: React.ReactNode;
  onPaginationChange?: (p: PaginationState) => void;
  onRowSelectionChange?: (selectedRowIds: string[]) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onSearchFilterChange?: (searchValue: string) => void;
}

export function Table<TData extends object>({
  collectionName,
  columns,
  toolbar,
  data = [],
  totalItems,
  isLoading,
  showFilterFields = true,
  pageSizeOptions,
  initialPagination,
  enableRowSelection = true,
  onPaginationChange,
  onRowSelectionChange,
  onSortingChange,
  onSearchFilterChange,
}: Props<TData>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex ?? 0,
    pageSize: initialPagination?.pageSize ?? 10,
  });
  const [filterValue, setFilterValue] = useState("");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  const columnsWithCheckbox = React.useMemo<ColumnDef<TData>[]>(
    () =>
      enableRowSelection
        ? [
            {
              id: "select",
              header: ({ table }) => (
                <input
                  type="checkbox"
                  checked={table.getIsAllPageRowsSelected()}
                  onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
              ),
              cell: ({ row }) => (
                <input
                  type="checkbox"
                  checked={row.getIsSelected()}
                  onChange={row.getToggleSelectedHandler()}
                />
              ),
            },
            ...columns,
          ]
        : [...columns],
    [columns, enableRowSelection]
  );

  const table = useReactTable({
    data,
    columns: columnsWithCheckbox,
    state: {
      rowSelection,
      sorting,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableSorting: !isLoading && data.length > 0,
    enableRowSelection,
  });

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
    // TODO we may need to reset based on other filters as well
  }, [sorting]);

  React.useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection).filter(
      (id) => rowSelection[id] === true
    );
    onRowSelectionChange?.(selectedRowIds);
  }, [rowSelection, onRowSelectionChange]);

  React.useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearchFilterChange?.(filterValue);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filterValue, onSearchFilterChange]);

  const filterableColumns = useCallback(
    () =>
      table.getHeaderGroups().map((headerGroup) =>
        headerGroup.headers
          .map((header) => {
            if (header.column.getCanFilter()) {
              return {
                value: header.column.columnDef.header
                  ?.toString()
                  .toLocaleLowerCase(),
                label: header.column.columnDef.header?.toString().toUpperCase(),
              };
            }
            return;
          })
          .filter((item) => item !== undefined)
      ),
    [table]
  );

  const loadingRows = Array.from({ length: 10 }).map((_, i) => (
    <tr key={`skeleton-${i}`}>
      {Array.from({ length: columns.length + 1 }).map((_, ci) => (
        <td key={`skeleton-cell-${i}-${ci}`}>
          <Skeleton className="h-[30px] w-[95%] rounded-md bg-primary-50 my-1 mx-z" />
        </td>
      ))}
    </tr>
  ));

  return (
    <div
      className={cn(
        "w-full flex flex-col h-full overflow-hidden",
        !showFilterFields && "justify-between"
      )}
      ref={tableContainerRef}
    >
      {showFilterFields && (
        <div className="flex w-full justify-between items-center mb-2">
          <h2 className="text-lg font-bold">{`List of ${collectionName?.charAt(0).toUpperCase() + collectionName?.slice(1).toLowerCase()}`}</h2>
          <div className="flex gap-5 items-center">
            {(filterableColumns()?.[0] as FilterOptionsType[]).length > 0 && (
              <div className="px-2 min-w-1/4 mt-2">
                <Input
                  type="search"
                  name="filter"
                  variant="search"
                  size="md"
                  leftNode={
                    <Icon icon="mynaui:search" className="ml-3 text-xl" />
                  }
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder={`Search ${collectionName?.toLocaleLowerCase() ?? "here"}`}
                  disabled={isLoading}
                />
              </div>
            )}
            {toolbar}
          </div>
        </div>
      )}

      <div className="overflow-auto bg-white p-2 pt-0 rounded-sm">
        <table className="w-full">
          <thead className="bg-white w-full sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      "text-left py-4 px-2 font-bold text-sm",
                      "cursor-pointer",
                      header.id === "select" && "w-0",
                      header.id === "Action" && "text-right"
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: (
                        <Icon
                          icon="lucide:sort-asc"
                          className="text-lg inline-block ml-1"
                        />
                      ),
                      desc: (
                        <Icon
                          icon="lucide:sort-desc"
                          className="text-lg inline-block ml-1"
                        />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="mt-4">
            {data.length === 0 || isLoading ? (
              isLoading ? (
                loadingRows
              ) : (
                <tr className="h-96 w-full">
                  <td
                    colSpan={columns.length + 1}
                    rowSpan={pagination.pageSize}
                    className="h-full w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon icon="lets-icons:sad-light" className="text-xl" />
                      Sorry, no results found!
                    </div>
                  </td>
                </tr>
              )
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(index % 2 === 0 && "bg-primary-50")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-0 px-2 text-sm font-medium">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        table={table}
        totalItems={totalItems}
        disabled={isLoading || data.length === 0}
        pageSizeOptions={pageSizeOptions}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
}
