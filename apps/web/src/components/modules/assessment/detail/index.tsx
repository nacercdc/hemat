import React from "react";
// import { UpsideDownInvertedTabs } from "~/components/ui/upside-down-inverted-tabs";
import { PageContainer } from "../../components/PageContainer";
import { CurrentAssessment } from "./tabs/current-assessment";
import { Tabs } from "@etm/web-ui-components";

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
              content: <div className="mt-7">Detail</div>,
            },
            {
              value: "current-assessment",
              label: "Current assessment",
              content: (
                <div>
                  <CurrentAssessment />
                </div>
              ),
            },
          ]}
          defaultValue="detail"
        />
      </div>
    </PageContainer>
  );
}
