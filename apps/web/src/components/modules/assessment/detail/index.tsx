import React from "react";

import { CurrentAssessment } from "./components/tabs/current-assessment";
import { Tabs } from "@etm/web-ui-components";
import AssessmentOverview from "./components/tabs/overview";
import { PageContainer } from "../../components/PageContainer";
import { Settings } from "./components/tabs/settings";

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
              value: "settings",
              label: "Settings",
              content: <Settings />,
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
