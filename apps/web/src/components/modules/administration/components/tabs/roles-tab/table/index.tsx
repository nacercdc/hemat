"use client";

import React, { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import type {
  Role,
  RoleIncludable,
  RoleSortable,
} from "~/libs/models/role.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useRouter } from "next/navigation";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import { Table as ETMTable } from "@etm/web-ui-components";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { RolesTableColumns } from "./RolesTableColumns";

export function RolesTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [_sort, setSort] = useState([
    {
      direction: "desc",
      field: "created_at",
    },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data: roles, ...rolesState } = useFindAll<
    QueryManyResponse<Role>,
    RoleIncludable,
    unknown,
    RoleSortable
  >({
    path: "/roles",
    queries: {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      include: ["permissions"],
      search,
    },
  });

  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={<Icon icon="oui:app-users-roles" className="w-16 h-16" />}
      title="No Role Records Yet"
      body="Click on the button below to add a Role."
      actionText="Add Role"
      action={() => router.push("/roles/add")}
    />
  );

  const onPageChangeHandler = (pageState: PaginationState) => {
    // TODO: Replace with a code that triggers our query hook with new pagination state

    setPagination(pageState);
  };

  const onSortingChangeHandler = (sortingState: SortingState) => {
    setSort(
      sortingState.map((v) => ({
        direction: v.desc ? "desc" : "asc",
        field: v.id,
      }))
    );

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

  return (
    <ETMTable<Role>
      columns={RolesTableColumns({
        refetch: rolesState.refetch,
      })}
      data={(roles?.data as unknown as Role[]) ?? []}
      onEmptyDataElement={OnEmptyDataElement}
      totalItems={roles?.total ?? DEFAULT_PAGE_SIZE}
      onPaginationChange={onPageChangeHandler}
      isLoading={rolesState.isLoading}
      onSortingChange={onSortingChangeHandler}
      onSearchFilterChange={onSearchFilterChangeHandler}
      enableRowSelection={false}
      pageSizeOptions={[10, 25, 50, 100]}
      initialPagination={pagination}
    />
  );
}
