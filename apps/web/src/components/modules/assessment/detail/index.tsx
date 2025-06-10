import React from "react";

import { PageContainer } from "../../components/PageContainer";
import { CurrentAssessment } from "./tabs/current-assessment";
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
            {
              value: "current-assessment",
              label: "Current assessment",
              content: <CurrentAssessment />,
            },
          ]}
          defaultValue="detail"
        />
      </div>
    </PageContainer>
  );
}
