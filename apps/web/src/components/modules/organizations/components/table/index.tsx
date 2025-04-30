"use client";

import React, { useEffect, useState } from "react";
import type { Organization } from "./OrganizationAction";
import type { PaginationState } from "@etm/web-ui-components";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { Table as ETMTable } from "@etm/web-ui-components";
import { OrganizationTableColumns } from "./OrganizationTableColumns";
import Toolbar from "./Toolbar";
import PageTableContainer from "~/components/modules/components/PageTableContainer";

export default function OrganizationTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const onPageChangeHandler = (pageState: PaginationState) => {
    setPagination(pageState);
  };

  useEffect(() => {
    setIsLoading(true);
    mockOrganizationFetch(pagination).then((data) => {
      setOrganizations(data.organizations);
      setIsLoading(false);
    });
  }, [pagination]);

  return (
    <PageTableContainer>
      <ETMTable<Organization>
        collectionName="Organizations"
        columns={OrganizationTableColumns({})}
        data={organizations}
        totalItems={125}
        isLoading={isLoading}
        onPaginationChange={onPageChangeHandler}
        pageSizeOptions={[10, 25, 50, 100]}
        enableRowSelection={true}
        initialPagination={pagination}
        toolbar={<Toolbar />}
      />
    </PageTableContainer>
  );
}

// Temporary mock organizations fetch
async function mockOrganizationFetch({
  pageIndex = 0,
  pageSize = 10,
}: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<{
  organizations: Organization[];
  total: number;
  startIndex: number;
  endIndex: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const totalOrganizations = 125;
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;

  const mockOrganizations: Organization[] = Array.from(
    { length: Math.min(pageSize, totalOrganizations - startIndex) },
    (_, i) => {
      const id = startIndex + i + 1;
      const phoneNumber = `+2519${Math.floor(Math.random() * 1000000000)}`;
      const email = `org-${id}@example.com`;

      return {
        id: id.toString(),
        name: `organization-${id}`,
        address: `address-${id}`,
        phoneNumber,
        email,
      };
    }
  );

  return {
    organizations: mockOrganizations,
    total: totalOrganizations,
    startIndex,
    endIndex,
  };
}
