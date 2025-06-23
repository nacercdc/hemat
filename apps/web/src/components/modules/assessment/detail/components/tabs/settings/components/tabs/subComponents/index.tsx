"use client";

import { useEffect, useState } from "react";

import { Content } from "./components/Content";

import type { AssessmentSubComponent } from "~/libs/models/assessment-sub-component.model";
import { Sidebar } from "../../Sidebar";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useParams } from "next/navigation";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { Icon } from "@iconify/react/dist/iconify.js";

export function SubComponents() {
  const params = useParams();
  const { id: assessmentId } = params;
  const { data: subComponents, ...subComponentsState } =
    useFindAll<AssessmentSubComponent>({
      path: `/assessments/${assessmentId as string}/sub-components`,
    });
  const [activeSubComponent, setActiveSubComponent] =
    useState<AssessmentSubComponent | null>(null);

  useEffect(() => {
    if (subComponents?.data && subComponents.data.length > 0) {
      setActiveSubComponent(subComponents.data[0] || null);
    }
  }, [subComponents]);

  return subComponents?.data && subComponents.data.length > 0 ? (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar<AssessmentSubComponent>
        list={subComponents?.data ?? []}
        activeItem={activeSubComponent}
        isLoading={subComponentsState.isLoading}
        onItemSelect={setActiveSubComponent}
        displayKey="name"
      />
      <Content
        activeSubComponent={activeSubComponent}
        assessmentId={assessmentId as string}
        refetchSubComponents={subComponentsState.refetch}
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

export default SubComponents;
