"use client";

import React, { useCallback, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Table as ETMTable } from "@etm/web-ui-components";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";

import Toolbar from "./Toolbar";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { SupportsTableColumns } from "./SupportsTableColumns";
import type { SortingState, PaginationState } from "@etm/web-ui-components";
import type { StatusType } from "./Toolbar";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type {
  Support,
  SupportIncludable,
  SupportSortable,
  SupportSorts,
} from "~/libs/models/support.model";

export function SupportTable() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SupportSorts>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data: supports, ...supportsState } = useFindAll<
    QueryManyResponse<Support>,
    SupportIncludable,
    unknown
  >({
    path: "/support",
    queries: {
      take: pagination.pageSize,
      skip: pagination.pageIndex + 1,
      sorts: sort,
      search,
    },
  });

  const onPageChangeHandler = (pageState: PaginationState) => {
    setPagination(pageState);
  };

  const onSortingChangeHandler = (sortingState: SortingState) => {
    const newSort: SupportSorts = {};

    sortingState.forEach((v) => {
      newSort[v.desc ? "descending" : "ascending"] =
        `${v.id}` as SupportSortable;
    });

    setSort(newSort);

    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };

  const onSearchFilterChangeHandler = useCallback((value: string) => {
    setSearch(value);

    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, []);

  const onStatusFilterChangeHandler = useCallback(
    (_statusType: StatusType[] | undefined) => {
      //TODO: implement status filter once the backend is ready
    },
    []
  );

  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={<Icon icon="mdi:support" className="w-16 h-16" />}
      title="No Supports Found"
      body="There are no support threads yet."
    />
  );

  return (
    <ETMTable<Support>
      columns={SupportsTableColumns()}
      data={(supports?.data as unknown as Support[]) ?? []}
      totalItems={supports?.total ?? DEFAULT_PAGE_SIZE}
      onPaginationChange={onPageChangeHandler}
      isLoading={supportsState.isLoading}
      onSortingChange={onSortingChangeHandler}
      onSearchFilterChange={onSearchFilterChangeHandler}
      pageSizeOptions={[10, 25, 50, 100]}
      enableRowSelection={false}
      initialPagination={pagination}
      onEmptyDataElement={OnEmptyDataElement}
      toolbar={<Toolbar onStatusTypeCheck={onStatusFilterChangeHandler} />}
    />
  );
}
