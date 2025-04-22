"use client";

import React, { useCallback, useState } from "react";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { cn } from "../../shadcn-ui/utils/cn";
import { Icon } from "@iconify/react";
import { Input, RadioGroup } from "../../forms";
import { DropdownMenu } from "../../navigations";

interface FilterOptionsType {
  value: string;
  label: string;
}
interface Props<TData> {
  columns: ColumnDef<TData>[];
  data?: TData[];
  isLoading: boolean;
  showFilterFields?: boolean;
  fetchNextPage?: () => void;
  fetchPreviousPage?: () => void;
  onRowSelectionChange?: (selectedRowIds: string[]) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onFilterChange?: (filters: ColumnFiltersState) => void;
}

export function Table<TData extends object>({
  columns,
  data = [],
  isLoading,
  showFilterFields = true,
  fetchNextPage,
  fetchPreviousPage,
  onRowSelectionChange,
  onSortingChange,
  onFilterChange,
}: Props<TData>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const [selectedColumn, setSelectedColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");

  React.useEffect(() => {
    setSelectedColumn(filterableColumns()?.[0]?.[0]?.value || "");
  }, []);

  const columnsWithCheckbox = React.useMemo<ColumnDef<TData>[]>(
    () => [
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
    ],
    [columns]
  );

  const table = useReactTable({
    data,
    columns: columnsWithCheckbox,
    state: {
      rowSelection,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  React.useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection).filter(
      (id) => rowSelection[id] === true
    );
    onRowSelectionChange?.(selectedRowIds);
  }, [rowSelection, onRowSelectionChange]);

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

  const onInputSubmitHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onFilterChange?.([{ id: selectedColumn, value: filterValue }]);
    }
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col h-full overflow-hidden",
        !showFilterFields && "justify-between"
      )}
    >
      {showFilterFields &&
        (filterableColumns()?.[0] as FilterOptionsType[]).length > 0 && (
          <div className="px-3 mb-1 max-w-md">
            <Input
              type="text"
              name="filter"
              size="sm"
              leftNode={
                <DropdownMenu
                  trigger={
                    <Icon icon="lucide:list-filter" className="text-xs" />
                  }
                  label={
                    <RadioGroup
                      labelKey="label"
                      valueKey="value"
                      defaultValue={
                        selectedColumn
                          ? {
                              label: selectedColumn.toUpperCase(),
                              value: selectedColumn.toLowerCase(),
                            }
                          : undefined
                      }
                      options={filterableColumns()[0] as FilterOptionsType[]}
                      size="sm"
                      name="searchFilters"
                      onValueChange={(v: FilterOptionsType) =>
                        setSelectedColumn(v.value)
                      }
                    />
                  }
                />
              }
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              onKeyDown={onInputSubmitHandler}
              placeholder={`Filter ${selectedColumn}`}
            />
          </div>
        )}
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-card-background w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      header.id === "select" && "w-0",
                      "text-left py-4 px-2 font-bold text-sm",
                      "cursor-pointer"
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-2 px-2 text-sm font-medium border-b"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && (
        <div
          className={cn(
            "px-2 flex gap-2 self-end mt-1",
            !showFilterFields && "justify-self-end"
          )}
        >
          <button onClick={() => fetchPreviousPage?.()} disabled={isLoading}>
            Previous
          </button>
          <button
            onClick={() => {
              fetchNextPage?.();
            }}
            disabled={isLoading}
          >
            Next
          </button>
        </div>
      )}

      {isLoading && <div className="self-center mt-4">Loading ...</div>}
    </div>
  );
}
