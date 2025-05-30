"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@etm/web-ui-components";
import { AssessmentsTable } from "./components/table";
import { PageContainer } from "../components/PageContainer";
import { PageHeader } from "../components/PageHeader";

export function Assessment() {
  return (
    <PageContainer>
      <PageHeader
        pageTitle="Assessments"
        breadcrumb={false}
        actions={
          <Button
            leftNode={
              <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
            }
            size="lg"
            onClick={() => {
              //TODO: Implement add assessment
            }}
          >
            Create
          </Button>
        }
      />
      <AssessmentsTable />
    </PageContainer>
  );
}
