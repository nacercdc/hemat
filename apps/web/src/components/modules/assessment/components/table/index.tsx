"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Table as ETMTable } from "@etm/web-ui-components";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { AssessmentsTableColumns } from "./AssessmentsTableColumns";

import type { SortingState, PaginationState } from "@etm/web-ui-components";
import type { Assessment, StatusType } from "~/libs/models/assessment.model";

export function AssessmentsTable() {
  const [assessmentData, setAssessmentData] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>();
  const [searchValue, setSearchValue] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

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
      startDate: "2023-01-15T08:30:00Z",
      endDate: "2023-01-15T08:30:00Z",
      country: { name: "Ethiopia" },
      status: [
        "Draft",
        "Pending",
        "Closed",
        "Ready",
        "In-Progress",
        "Completed",
      ][Math.floor(Math.random() * 5)] as StatusType,
      createdAt: "2023-01-15T08:30:00Z",
    })
  );

  return {
    assessments: mockAssessments,
    total: totalAssessments,
    startIndex,
    endIndex,
  };
}
