"use client";

import { Icon } from "@iconify/react";
import { Button } from "@etm/web-ui-components";
import { AssessmentsTable } from "./components/table";
import { PageContainer } from "../components/PageContainer";
import { useRouter, useSearchParams } from "next/navigation";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { useEffect } from "react";

export function Assessment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh") === "true";

  // const { data: assessments, ...languagesState } = useFindAll<
  //   QueryManyResponse<Assessment>
  // >({
  //   path: "/assessments",
  // });

  // useEffect(() => {
  //   if (shouldRefresh) {
  //     refetch();
  //   }
  // }, [shouldRefresh, refetch]);

  return (
    <PageContainer
      pageTitle="Assessments"
      includeBreadcrumb={false}
      actionNodes={
        <Button
          leftNode={
            <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
          }
          size="lg"
          onClick={() => {
            router.push("/assessment/create");
          }}
        >
          Create
        </Button>
      }
    >
      <AssessmentsTable />
    </PageContainer>
  );
}
