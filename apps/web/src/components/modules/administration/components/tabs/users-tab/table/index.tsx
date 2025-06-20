"use client";

import React, { useCallback, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Table as ETMTable } from "@etm/web-ui-components";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { UsersTableColumns } from "./UsersTableColumns";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import Toolbar from "./Toolbar";
import type {
  User,
  UserIncludable,
  UserSortable,
  UserSorts,
} from "~/libs/models/user.model";
import type { SortingState, PaginationState } from "@etm/web-ui-components";
import type { StatusType } from "./Toolbar";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { PermissionModule } from "../form";
import type { Permission } from "~/libs/models/permission.model";

interface Props {
  modules: PermissionModule[];
  permissions?: Permission[];
}

export function UsersTable({ modules, permissions }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<UserSorts>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data: users, ...usersState } = useFindAll<
    QueryManyResponse<User>,
    UserIncludable,
    unknown
  >({
    path: "/users",
    queries: {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      include: ["permissions", "roles"],
      sorts: sort,
      search,
    },
  });

  const onPageChangeHandler = (pageState: PaginationState) => {
    setPagination(pageState);
  };

  const onSortingChangeHandler = (sortingState: SortingState) => {
    const newSort: UserSorts = {};

    sortingState.forEach((v) => {
      newSort[v.desc ? "descending" : "ascending"] = `${v.id}` as UserSortable;
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

  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={<Icon icon="mdi:users-outline" className="w-16 h-16" />}
      title="No Users Found"
      body="You can add a new user by clicking the button below."
      actionText="Add User"
      action={() => {
        //TODO: Implement add user
      }}
    />
  );

  return (
    <ETMTable<User>
      columns={UsersTableColumns({
        refetch: usersState.refetch,
        modules,
        permissions,
      })}
      data={(users?.data as unknown as User[]) ?? []}
      totalItems={users?.total ?? DEFAULT_PAGE_SIZE}
      onPaginationChange={onPageChangeHandler}
      isLoading={usersState.isLoading}
      onSortingChange={onSortingChangeHandler}
      onSearchFilterChange={onSearchFilterChangeHandler}
      pageSizeOptions={[10, 25, 50, 100]}
      enableRowSelection={false}
      initialPagination={pagination}
      onEmptyDataElement={OnEmptyDataElement}
      toolbar={
        <Toolbar
          onStatusTypeCheck={(stc) =>
            ((st?: StatusType[]) => console.log(st))(stc)
          }
        />
      }
    />
  );
}
