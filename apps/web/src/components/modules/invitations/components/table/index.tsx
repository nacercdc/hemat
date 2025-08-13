"use client";

import { Icon } from "@iconify/react";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import { Table as ETMTable } from "@etm/web-ui-components";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  Invitation,
  InvitationFilterable,
  InvitationIncludable,
  InvitationSortable,
} from "~/libs/models/invitaion.model";
import { InvitationsTableColumns } from "./InvitationsTableColumns";

export const INVITATION_LIST_KEY = "invitation-list";

export function InvitationsTable() {
  const [search, setSearch] = useState("");
  const [_sort, setSort] = useState<
    { direction: string; field: string | number | symbol }[]
  >([
    {
      direction: "desc",
      field: "created_at",
    },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data: invitations, ...invitationsState } = useFindAll<
    Invitation,
    InvitationIncludable,
    InvitationFilterable,
    InvitationSortable
  >({
    path: "/assessments/me/invitations",
    queries: {
      take: pagination.pageSize,
      skip: pagination.pageIndex,
      search,
      include: ["assessment"],
    },
    tqOptions: {
      queryKey: [INVITATION_LIST_KEY, pagination, search, _sort],
    },
  });

  const onSortingChangeHandler = useCallback((sortingState: SortingState) => {
    setSort(
      sortingState.map((v) => ({
        direction: v.desc ? "desc" : "asc",
        field: v.id as keyof Invitation,
      }))
    );
    setPagination((prev) => ({
      ...prev,
      pageIndex: DEFAULT_PAGE_INDEX,
    }));
  }, []);

  const onSearchFilterChangeHandler = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPagination((prev) => ({
        ...prev,
        pageIndex: DEFAULT_PAGE_INDEX,
      }));
    }, 300),
    []
  );

  const OnEmptyDataElement = useMemo(
    () => (
      <EmptyTableDataElement
        icon={
          <Icon
            icon="material-symbols-light:scale-balance"
            className="w-16 h-16"
          />
        }
        title="No invitation Found"
        body="No invitations to show."
      />
    ),
    []
  );

  return (
    <div className="h-full bg-card pt-4 rounded-md">
      <ETMTable<Invitation>
        columns={InvitationsTableColumns}
        data={invitations?.data}
        totalItems={invitations?.total ?? DEFAULT_PAGE_SIZE}
        isLoading={invitationsState.isLoading}
        onSortingChange={onSortingChangeHandler}
        onSearchFilterChange={onSearchFilterChangeHandler}
        onPaginationChange={setPagination}
        pageSizeOptions={[10, 25, 50, 100]}
        enableRowSelection={false}
        onEmptyDataElement={OnEmptyDataElement}
      />
    </div>
  );
}
