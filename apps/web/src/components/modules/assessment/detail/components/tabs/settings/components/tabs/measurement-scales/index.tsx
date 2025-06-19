"use client";

import { useState } from "react";

import { Content } from "./components/Content";
import type { AssessmentMeasurementScale } from "../../../types/index";
import { Sidebar } from "../../Sidebar";

//TODO Replace with real data
const measurementScales: AssessmentMeasurementScale[] = [
  {
    id: "1",
    name: "MeasurementScale 1",
    code: "Initial description",
    description: "Initial description about Leadership and Governance",
    assessmentId: "assessment-123",
  },
  {
    id: "2",
    name: "MeasurementScale 2",
    code: "Initial description",
    description: "Initial description about Management and Workforce",
    assessmentId: "assessment-123",
  },
  {
    id: "3",
    name: "MeasurementScale 3",
    code: "Initial description",
    description: "Initial description about ICT Infrastructure",
    assessmentId: "assessment-124",
  },
  {
    id: "4",
    name: "MeasurementScale 4",
    code: "Initial description",
    description: "Initial description about Standards and Interoperability",
    assessmentId: "assessment-124",
  },
];

export function MeasurementScales() {
  const [activeMeasurementScale, setActiveMeasurementScale] =
    useState<AssessmentMeasurementScale | null>(measurementScales[0] ?? null);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar
        list={measurementScales}
        activeItem={activeMeasurementScale}
        onItemSelect={setActiveMeasurementScale}
        displayKey="name"
      />
      <Content activeMeasurementScale={activeMeasurementScale} />
    </div>
  );
}

export default MeasurementScales;
