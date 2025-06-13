"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Table as ETMTable } from "@etm/web-ui-components";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { AssessmentsTableColumns } from "./AssessmentsTableColumns";

import type { SortingState, PaginationState } from "@etm/web-ui-components";
import type {
  Assessment,
  AssessmentFilters,
  AssessmentSorts,
  StatusType,
} from "~/libs/models/assessment.model";
import { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";

export function AssessmentsTable() {
  const [assessmentData, setAssessmentData] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>();
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");
  const [_sort, setSort] = useState<
    {
      direction: string;
      field: string | number | symbol;
    }[]
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

  const { data: scales, ...scalesState } = useFindAll<
    QueryManyResponse<Assessment>,
    unknown,
    AssessmentSorts,
    AssessmentFilters
  >({
    path: "/assessments",
    queries: {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      search,
    },
  });

  const onSortingChangeHandler = (sortingState: SortingState) => {
    setSort(
      sortingState.map((v) => ({
        direction: v.desc ? "desc" : "asc",
        field: v.id as keyof Assessment,
      }))
    );
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };
  const onSearchFilterChangeHandler = useCallback((value: string) => {
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

  useEffect(() => {
    setIsLoading(true);
    mockAssessmentsFetch(pagination).then((data) => {
      setAssessmentData(data.assessments);
      setIsLoading(false);
    });
  }, [pagination, sorting, searchValue]);

  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={<Icon icon="fluent-mdl2:assessment-group" className="w-16 h-16" />}
      title="No Assessments Found"
      body="You can add a new assessment by clicking the button below."
      actionText="Add Assessment"
      action={() => {
        //TODO: Implement add assessment
      }}
    />
  );

  return (
    <div className="h-full bg-card pt-4 rounded-md">
      <ETMTable<Assessment>
        columns={AssessmentsTableColumns({
          refetch: () => {
            //TODO: will be replaced with assessment refetch func
          },
        })}
        data={assessmentData}
        //  assessments={(languages?.data as unknown as Language[]) ?? []}
        totalItems={125}
        onPaginationChange={onPageChangeHandler}
        isLoading={isLoading}
        onSortingChange={onSortingChangeHandler}
        onSearchFilterChange={onSearchFilterChangeHandler}
        pageSizeOptions={[10, 25, 50, 100]}
        enableRowSelection={false}
        initialPagination={pagination}
        onEmptyDataElement={OnEmptyDataElement}
      />
    </div>
  );
}

// Temporary mock assessments fetch
async function mockAssessmentsFetch({
  pageIndex = 0,
  pageSize = 10,
}: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<{
  assessments: Assessment[];
  total: number;
  startIndex: number;
  endIndex: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const totalAssessments = 125;
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;

  const mockAssessments: Assessment[] = Array.from(
    { length: Math.min(pageSize, totalAssessments - startIndex) },
    (_, i) => ({
      id: startIndex + i + 1,
      name: `Assessment - ${startIndex + i + 1}`,
      createdBy: {
        firstName: `Firstname-${startIndex + i + 1}`,
        lastName: `Lastname-${startIndex + i + 1}`,
      },
      startDate: new Date("2023-01-15T08:30:00Z"),
      endDate: new Date("2023-01-15T08:30:00Z"),
      createdAt: "2023-01-15T08:30:00Z", // as string
      countryCode: "ET", // just the code
      status: [
        "Draft",
        "Pending",
        "Closed",
        "Ready",
        "In-Progress",
        "Completed",
      ][Math.floor(Math.random() * 6)] as StatusType,
    })
  );

  return {
    assessments: mockAssessments,
    total: totalAssessments,
    startIndex,
    endIndex,
  };
}
