"use client";

import { useState } from "react";

import { Content } from "./components/Content";
import type { AssessmentSubComponent } from "../../../types/index";
import { Sidebar } from "../../Sidebar";

//TODO Replace with real data
const subComponents: AssessmentSubComponent[] = [
  {
    id: "1",
    name: "SubComponent 1",
    code: "Initial description",
    description: "Initial description about Leadership and Governance",
    assessmentId: "assessment-123",
    componentId: "component-123",
  },
  {
    id: "2",
    name: "SubComponent 2",
    code: "Initial description",
    description: "Initial description about Management and Workforce",
    assessmentId: "assessment-123",
    componentId: "component-123",
  },
  {
    id: "3",
    name: "SubComponent 3",
    code: "Initial description",
    description: "Initial description about ICT Infrastructure",
    assessmentId: "assessment-123",
    componentId: "component-124",
  },
  {
    id: "4",
    name: "SubComponent 4",
    code: "Initial description",
    description: "Initial description about Standards and Interoperability",
    assessmentId: "assessment-123",
    componentId: "component-124",
  },
];

export function SubSubComponents() {
  const [activeSubComponent, setActiveSubComponent] =
    useState<AssessmentSubComponent | null>(subComponents[0] ?? null);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar
        list={subComponents}
        activeItem={activeSubComponent}
        onItemSelect={setActiveSubComponent}
        groupByKey="componentId"
        displayKey="name"
      />
      <Content activeSubComponent={activeSubComponent} />
    </div>
  );
}

export default SubSubComponents;
