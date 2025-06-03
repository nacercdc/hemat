"use client";

import { Icon } from "@iconify/react";
import { Button } from "@etm/web-ui-components";
import { AssessmentsTable } from "./components/table";
import { PageContainer } from "../components/PageContainer";
import { useRouter } from "next/navigation";

export function Assessment() {
  const router = useRouter();
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
