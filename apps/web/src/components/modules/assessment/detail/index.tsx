"use client";

import React, { useCallback } from "react";

import { CurrentAssessment } from "./components/tabs/current-assessment";
import { Tabs } from "@etm/web-ui-components";
import MemberInvitation from "./components/tabs/members";
import AssessmentOverview from "./components/tabs/overview";
import { PageContainer } from "../../components/PageContainer";
import { Settings } from "./components/tabs/settings";
import { useParams, useRouter } from "next/navigation";
import { RoadmapDomainGroup } from "./components/tabs/roadmap";

export function AssessmentDetail() {
  const assessmentName = "Assessment 1";
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id;

  const onBackHandler = useCallback(() => {
    router.back();
  }, [assessmentId]);

  return (
    <PageContainer
      pageTitle={`${assessmentName}`}
      includeBreadcrumb={false}
      onBack={onBackHandler}
    >
      <div className="px-8 h-full">
        <Tabs
          options={[
            {
              value: "detail",
              label: "Detail",
              content: <AssessmentOverview />,
            },
            {
              value: "member",
              label: "Member",
              content: <MemberInvitation />,
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
            {
              value: "roadmap",
              label: "Roadmap",
              content: <RoadmapDomainGroup />,
            },
          ]}
          defaultValue="detail"
        />
      </div>
    </PageContainer>
  );
}
