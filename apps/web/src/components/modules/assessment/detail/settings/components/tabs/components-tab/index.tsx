"use client";

import { useEffect, useState } from "react";

import { Content } from "./components/Content";
import { SidebarSkeleton } from "../../SidebarSkeleton";
import { ContentSkeleton } from "./components/ContentSkeleton";

import type { AssessmentComponent } from "~/libs/models/assessment-component.model";
import { Sidebar } from "../../Sidebar";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useParams } from "next/navigation";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type {
  Assessment,
  AssessmentsIncludeAble,
} from "~/libs/models/assessment.model";

export function ComponentTab() {
  const params = useParams();
  const { id: assessmentId } = params;

  const { data: assessment } = useFindById<Assessment, AssessmentsIncludeAble>({
    path: `assessments/${assessmentId as string}`,
  });

  const { data: components, ...componentsState } =
    useFindAll<AssessmentComponent>({
      path: `/assessments/${assessmentId as string}/components`,
    });
  const [activeComponent, setActiveComponent] =
    useState<AssessmentComponent | null>(null);

  useEffect(() => {
    if (components?.data && components.data.length > 0) {
      setActiveComponent(components.data[0] || null);
    }
  }, [components]);

  return componentsState.isLoading ? (
    <div className="flex flex-col lg:flex-row h-full">
      <SidebarSkeleton itemCount={5} />
      <ContentSkeleton />
    </div>
  ) : components?.data && components.data.length > 0 ? (
    <div className="flex flex-col lg:flex-row h-full">
      <Sidebar<AssessmentComponent>
        list={components?.data ?? []}
        activeItem={activeComponent}
        isLoading={componentsState.isLoading}
        onItemSelect={setActiveComponent}
        displayKey="name"
      />
      <Content
        activeComponent={activeComponent}
        assessmentId={assessmentId as string}
        assessment={assessment}
        refetchComponents={componentsState.refetch}
      />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full  min-h-96">
      <EmptyTableDataElement
        title="No components found"
        icon={
          <Icon
            icon="material-symbols-light:component-rounded"
            className="!w-[30px] !h-[30px]"
          />
        }
      />
    </div>
  );
}

export default ComponentTab;
