"use client";

import React, { useCallback, useRef, useEffect, useState } from "react";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
  Row,
  ExpandedState,
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
  collectionName?: string;
  columns: ColumnDef<TData>[];
  data?: TData[];
  toolbar?: React.ReactNode;
  totalItems: number;
  isLoading: boolean;
  pageSizeOptions?: number[];
  initialPagination?: PaginationState;
  enableRowSelection?: boolean;
  enableExpanding?: boolean;
  onEmptyDataElement?: React.ReactNode;
  getExpandedContent?: (row: Row<TData>) => Promise<React.ReactNode>;
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
  pageSizeOptions,
  initialPagination,
  enableRowSelection = true,
  enableExpanding = false,
  onEmptyDataElement,
  getExpandedContent,
  onPaginationChange,
  onRowSelectionChange,
  onSortingChange,
  onSearchFilterChange,
}: Props<TData>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex ?? 0,
    pageSize: initialPagination?.pageSize ?? 10,
  });
  const [expandedContent, setExpandedContent] = useState<
    Record<string, React.ReactNode>
  >({});
  const [loadingExpandedRows, setLoadingExpandedRows] = useState<Set<string>>(
    new Set()
  );
  const [errorExpandedRows, setErrorExpandedRows] = useState<Set<string>>(
    new Set()
  );
  const [filterValue, setFilterValue] = useState("");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  const finalColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    let cols = [...columns];

    if (enableRowSelection) {
      cols = [
        {
          id: "select",
          size: 30,
          minSize: 30,
          maxSize: 30,
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
        ...cols,
      ];
    }

    if (enableExpanding) {
      cols = [
        {
          id: "expander",
          size: 30,
          minSize: 30,
          maxSize: 30,
          header: () => null,
          cell: ({ row }) => (
            <button
              onClick={row.getToggleExpandedHandler()}
              className="cursor-pointer"
            >
              {row.getIsExpanded() ? (
                <Icon icon="lucide:chevron-up" />
              ) : (
                <Icon icon="lucide:chevron-down" />
              )}
            </button>
          ),
        },
        ...cols,
      ];
    }

    return cols;
  }, [columns, enableRowSelection, enableExpanding]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      rowSelection,
      sorting,
      expanded,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: () => true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableSorting: !isLoading && data.length > 0,
    enableExpanding,
    enableRowSelection,
  });

  useEffect(() => {
    if (!getExpandedContent) return;

    Object.entries(expanded).forEach(([key, isExpanded]) => {
      if (
        isExpanded &&
        expandedContent[key] === undefined &&
        !loadingExpandedRows.has(key) &&
        !errorExpandedRows.has(key)
      ) {
        setLoadingExpandedRows((prev) => new Set([...prev, key]));
        getExpandedContent(table.getRow(key))
          .then((content) => {
            setExpandedContent((prev) => ({ ...prev, [key]: content }));
          })
          .catch(() => {
            setErrorExpandedRows((prev) => new Set([...prev, key]));
          })
          .finally(() => {
            setLoadingExpandedRows((prev) => {
              const newSet = new Set(prev);
              newSet.delete(key);
              return newSet;
            });
          });
      }
    });
  }, [
    expanded,
    getExpandedContent,
    table,
    expandedContent,
    loadingExpandedRows,
    errorExpandedRows,
  ]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
    // TODO we may need to reset based on other filters as well
  }, [sorting]);

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection).filter(
      (id) => rowSelection[id] === true
    );
    onRowSelectionChange?.(selectedRowIds);
  }, [rowSelection, onRowSelectionChange]);

  useEffect(() => {
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
      {Array.from({
        length: columns.length + (enableRowSelection ? 1 : 0),
      }).map((_, ci) => (
        <td key={`skeleton-cell-${i}-${ci}`}>
          <Skeleton className="h-[30px] w-[95%] rounded-md bg-primary-50 my-1 mx-z" />
        </td>
      ))}
    </tr>
  ));

  return (
    <div className={cn("w-full flex flex-col h-full")} ref={tableContainerRef}>
      {onSearchFilterChange ? (
        <div className="flex w-full justify-between items-center mb-2">
          {collectionName &&
            !(filterableColumns()?.[0] as FilterOptionsType[]).length && (
              <h2 className="text-lg font-bold">{`List of ${collectionName?.charAt(0).toUpperCase() + collectionName?.slice(1).toLowerCase()}`}</h2>
            )}
          <div className="flex gap-1 min-[400px]:gap-5 items-center justify-between w-full max-[400px]:flex-col-reverse max-[400px]:items-end">
            {(filterableColumns()?.[0] as FilterOptionsType[]).length > 0 && (
              <div className="max-w-sm w-full mt-2">
                <Input
                  name="filter"
                  size="lg"
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
            <div>{toolbar}</div>
          </div>
        </div>
      ) : (
        <div className="flex mb-2"> {toolbar}</div>
      )}
      <div className="flex flex-col min-h-[650px] justify-between bg-transparent rounded-sm h-full">
        <div className=" p-0 rounded-sm rounded-b-none border-[1px] border-basic-300 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-basic-200 w-full">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        "text-left py-4 px-2 font-bold text-[13px]",
                        "cursor-pointer",
                        header.id === "select" && "w-0",
                        header.id === "expander" && "w-0",
                        header.id === "Action" &&
                          "text-right sticky right-0 bg-basic-200 w-[1%] whitespace-nowrap"
                      )}
                      style={
                        header.id === "Action"
                          ? { width: "1%", whiteSpace: "nowrap" }
                          : {}
                      }
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
                      colSpan={
                        columns.length +
                        (enableRowSelection ? 1 : 0) +
                        (enableExpanding ? 1 : 0)
                      }
                      rowSpan={pagination.pageSize}
                      className="h-full w-full"
                    >
                      {onEmptyDataElement ?? (
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="flex items-center justify-center w-32 h-32 rounded-full bg-tbaccent">
                            <Icon
                              icon="fluent:collections-empty-20-regular"
                              className="w-16 h-16 text-primary"
                            />
                          </div>
                          <h6 className="text-primary text-sm">
                            Sorry, no results found
                          </h6>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <React.Fragment key={row.id}>
                    <tr
                      key={row.id}
                      className={cn("bg-card hover:bg-primary-50/40 h-11", {
                        "border-b-[1px] border-basic-300":
                          index !== table.getRowModel().rows.length - 1,
                      })}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isActionColumn = cell.column.id === "Action";
                        return (
                          <td
                            key={cell.id}
                            className={cn(
                              "py-0 px-2 text-sm font-medium",
                              isActionColumn &&
                                "text-right sticky right-0 bg-card z-10 w-[1%] whitespace-nowrap"
                            )}
                            style={
                              isActionColumn
                                ? { width: "1%", whiteSpace: "nowrap" }
                                : {}
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {row.getIsExpanded() && getExpandedContent && (
                      <tr>
                        <td
                          colSpan={row.getVisibleCells().length}
                          className="px-2 text-sm font-medium"
                        >
                          {loadingExpandedRows.has(row.id) ? (
                            <Skeleton className="h-[100px] w-full rounded-md my-2" />
                          ) : errorExpandedRows.has(row.id) ? (
                            <div>Error loading expanded content</div>
                          ) : (
                            expandedContent[row.id]
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        {onPaginationChange && (
          <TablePagination
            table={table}
            totalItems={totalItems}
            disabled={isLoading || data.length === 0}
            pageSizeOptions={pageSizeOptions}
            onPaginationChange={onPaginationChange}
          />
        )}
      </div>
    </div>
  );
}
