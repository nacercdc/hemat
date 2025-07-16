"use client";

import React, { Suspense, useCallback } from "react";
import Loading from "~/app/(protected)/(dashboard)/loading";
import { Skeleton, Tabs } from "@etm/web-ui-components";
import { useParams, usePathname, useRouter } from "next/navigation";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { cn } from "~/utils/cn.util";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type { Assessment } from "~/libs/models/assessment.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";

const TABS = [
  { value: "detail", label: "Detail" },
  { value: "setting", label: "Setting" },
  { value: "member", label: "Participants" },
  { value: "current-assessments", label: "Current Assessment" },
  { value: "roadmap", label: "Roadmap" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

interface Props {
  children: React.ReactNode;
}

export function AssessmentDetailLayout({ children }: Props) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const assessmentId = params.id as string;

  const { data: assessment, ...assessmentState } = useFindById<
    QueryManyResponse<Assessment>,
    unknown
  >({
    path: `/assessments/${assessmentId}`,
  });

  const currentTab = pathname.split("/").pop() as TabValue | undefined;
  const showTabs = TABS.some((tab) => tab.value === currentTab);

  const onTabClick = useCallback(
    (value: TabValue) => {
      router.push(`/assessment/${assessmentId}/${value}`);
    },
    [router, assessmentId]
  );

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  const renderWithTabs = (
    <PageContainer
      pageTitle={
        <>
          {!assessmentState.isFetching && (
            <div>{(assessment as unknown as Assessment).name}</div>
          )}
          {assessmentState.isFetching && <Skeleton className="w-36 h-6" />}
        </>
      }
      includeBreadcrumb={false}
      onBack={onBack}
    >
      <div className="px-8">
        <Tabs
          options={TABS}
          defaultValue={
            TABS.find((tab) => tab.value === currentTab)?.value ?? "detail"
          }
          onTabClick={onTabClick}
        />
        <Suspense fallback={<Loading />}>
          <div className={cn(showTabs && "-mt-8")}>{children}</div>
        </Suspense>
      </div>
    </PageContainer>
  );

  return showTabs ? renderWithTabs : <>{children}</>;
}
