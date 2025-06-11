import React from "react";
import { PageContainer } from "../../components/PageContainer";
import { Tabs } from "@etm/web-ui-components";
import AssessmentOverview from "./tabs/overview";
import MemberInvitation from "./tabs/members";

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
          ]}
          defaultValue="detail"
        />
      </div>
    </PageContainer>
  );
}
