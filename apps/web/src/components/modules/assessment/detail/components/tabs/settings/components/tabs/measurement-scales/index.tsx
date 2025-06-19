"use client";

import { useEffect, useState } from "react";

import { Content } from "./components/Content";

import { Sidebar } from "../../Sidebar";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useParams } from "next/navigation";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";

export function MeasurementScales() {
  const params = useParams();
  const { id: assessmentId } = params;
  const { data: components, ...componentsState } =
    useFindAll<AssessmentMeasurementScale>({
      path: `/assessments/${assessmentId as string}/measurement-scales`,
    });
  const [activeComponent, setActiveComponent] =
    useState<AssessmentMeasurementScale | null>(null);

  useEffect(() => {
    if (components?.data && components.data.length > 0) {
      setActiveComponent(components.data[0] || null);
    }
  }, [components]);

  return components?.data && components.data.length > 0 ? (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar<AssessmentMeasurementScale>
        list={components?.data ?? []}
        activeItem={activeComponent}
        isLoading={componentsState.isLoading}
        onItemSelect={setActiveComponent}
        displayKey="name"
      />
      <Content
        activeMeasurementScale={activeComponent}
        assessmentId={assessmentId as string}
        refetchMeasurementScales={componentsState.refetch}
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

export default MeasurementScales;
