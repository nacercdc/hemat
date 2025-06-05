import React from "react";
// import { UpsideDownInvertedTabs } from "~/components/ui/upside-down-inverted-tabs";
import { PageContainer } from "../../components/PageContainer";
import { Tabs } from "@etm/web-ui-components";
import AssessmentOverview from "./tabs/overview";

export function AssessmentDetail() {
  const assessmentName = "Assessment 1";
  return (
    <PageContainer pageTitle={`${assessmentName}`} includeBreadcrumb={false}>
      <div className="px-8">
        <Tabs
          options={[
            {
              value: "detail",
              label: "Detail",
              content: <AssessmentOverview />,
            },
          ]}
          defaultValue="detail"
        />
      </div>
    </PageContainer>
  );
}
