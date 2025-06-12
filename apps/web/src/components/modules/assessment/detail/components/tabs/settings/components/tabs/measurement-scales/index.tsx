"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Content } from "./components/Content";
import type { Domain as MeasurementScale } from "../../../types/index";

//TODO Replace with real data
const measurementScales: MeasurementScale[] = [
  {
    id: "1",
    name: "MeasurementScale 1",
    code: "Initial description",
    description: "Initial description about Leadership and Governance",
  },
  {
    id: "2",
    name: "MeasurementScale 2",
    code: "Initial description",
    description: "Initial description about Management and Workforce",
  },
  {
    id: "3",
    name: "MeasurementScale 3",
    code: "Initial description",
    description: "Initial description about ICT Infrastructure",
  },
  {
    id: "4",
    name: "MeasurementScale 4",
    code: "Initial description",
    description: "Initial description about Standards and Interoperability",
  },
];

export function MeasurementScales() {
  const [activeMeasurementScale, setActiveMeasurementScale] =
    useState<MeasurementScale | null>(measurementScales[0] ?? null);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar
        measurementScales={measurementScales}
        activeMeasurementScale={activeMeasurementScale}
        onMeasurementScaleSelect={setActiveMeasurementScale}
      />
      <Content activeMeasurementScale={activeMeasurementScale} />
    </div>
  );
}

export default MeasurementScales;
