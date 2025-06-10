"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Table as ETMTable } from "@etm/web-ui-components";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { UsersTableColumns } from "./UsersTableColumns";

import type { SortingState, PaginationState } from "@etm/web-ui-components";
import { UserStatus } from "~/libs/models/user.model";
import type { User } from "~/libs/models/user.model";
import type { StatusType } from "./Toolbar";
import Toolbar from "./Toolbar";

export function UsersTable() {
  const [usersData, setUsersData] = useState<Partial<User>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>();
  const [searchValue, setSearchValue] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    setIsLoading(true);
    mockUsersFetch(pagination).then((data) => {
      setUsersData(data.users);
      setIsLoading(false);
    });
  }, [pagination, sorting, searchValue]);

  const onSortingChangeHandler = (sortingState: SortingState) => {
    // TODO: Replace with a code that triggers our query hook with new sorting state

    setSorting(sortingState);
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };

  const onSearchFilterChangeHandler = useCallback((value: string) => {
    // TODO: Replace with a code that triggers our query hook with new search filter state

    setSearchValue(value);
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, []);

  const onPageChangeHandler = (pageState: PaginationState) => {
    // TODO: Replace with a code that triggers our query hook with new pagination state

    setPagination(pageState);
  };

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
    <ETMTable<Partial<User>>
      columns={UsersTableColumns({
        refetch: () => {
          //TODO: will be replaced with user refetch func
        },
      })}
      data={usersData}
      totalItems={125}
      onPaginationChange={onPageChangeHandler}
      isLoading={isLoading}
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

// Temporary mock users fetch
async function mockUsersFetch({
  pageIndex = 0,
  pageSize = 10,
}: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<{
  users: Partial<User>[];
  total: number;
  startIndex: number;
  endIndex: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const totalUsers = 125;
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;

  const mockUsers: Partial<User>[] = Array.from(
    { length: Math.min(pageSize, totalUsers - startIndex) },
    (_, i) => ({
      id: `${startIndex + i + 1}`,
      name: `Firstname - ${startIndex + i + 1} Lastname - ${startIndex + i + 1}`,
      firstName: `Firstname - ${startIndex + i + 1}`,
      lastName: `Lastname - ${startIndex + i + 1}`,
      email: `example-email-${startIndex + i + 1}@gmail.com`,
      roles: [
        {
          id: "1",
          name: "User",
          description: "User Role",
          permissions: [
            {
              id: `perm-${startIndex + i + 1}`,
              action: "read",
              subject: "USER",
            },
          ],
          createdAt: "2023-01-15T08:30:00Z",
          updatedAt: "2023-01-15T08:30:00Z",
        },
      ],
      status: UserStatus.ACTIVE,
      createdAt: "2023-01-15T08:30:00Z",
    })
  );

  return {
    users: mockUsers,
    total: totalUsers,
    startIndex,
    endIndex,
  };
}
