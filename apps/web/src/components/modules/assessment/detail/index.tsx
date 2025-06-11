import React from "react";

import { CurrentAssessment } from "./components/tabs/current-assessment";
import { Tabs } from "@etm/web-ui-components";
import MemberInvitation from "./components/tabs/members";
import AssessmentOverview from "./components/tabs/overview";
import { PageContainer } from "../../components/PageContainer";

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
              value: "setting",
              label: "Setting",
              content: <AssessmentOverview />,
            },
            {
              value: "member",
              label: "Member",
              content: <MemberInvitation />,
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
