"use client";

import React, { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useRouter } from "next/navigation";
import { Table as ETMTable } from "@etm/web-ui-components";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { RolesTableColumns } from "./RolesTableColumns";
import type {
  Role,
  RoleIncludable,
  RoleSortable,
  RoleSorts,
} from "~/libs/models/role.model";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import type { PermissionModule } from "../form";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Permission } from "~/libs/models/permission.model";

interface Props {
  modules: PermissionModule[];
  permissions?: Permission[];
}

export function RolesTable({ modules, permissions }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<RoleSorts>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data: roles, ...rolesState } = useFindAll<
    QueryManyResponse<Role>,
    RoleIncludable,
    unknown
  >({
    path: "/roles",
    queries: {
      take: pagination.pageSize,
      skip: pagination.pageIndex + 1,
      include: ["permissions"],
      sorts: sort,
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
    const newSort: RoleSorts = {};

    sortingState.forEach((v) => {
      newSort[v.desc ? "descending" : "ascending"] = `${v.id}` as RoleSortable;
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

  return (
    <ETMTable<Role>
      columns={RolesTableColumns({
        refetch: rolesState.refetch,
        modules,
        permissions,
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
