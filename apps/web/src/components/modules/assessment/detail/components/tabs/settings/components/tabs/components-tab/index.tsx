"use client";

import { useState } from "react";
import { Content } from "./components/Content";
import type { AssessmentComponent } from "../../../types/index";
import { Sidebar } from "../../Sidebar";

//TODO Replace with real data
const components: AssessmentComponent[] = [
  {
    id: "1",
    name: "Component 1",
    code: "Initial description",
    description: "Initial description about Leadership and Governance",
    assessmentId: "assessment-123",
    domainId: "domain-123",
  },
  {
    id: "2",
    name: "Component 2",
    code: "Initial description",
    description: "Initial description about Management and Workforce",
    assessmentId: "assessment-123",
    domainId: "domain-123",
  },
  {
    id: "3",
    name: "Component 3",
    code: "Initial description",
    description: "Initial description about ICT Infrastructure",
    assessmentId: "assessment-124",
    domainId: "domain-124",
  },
  {
    id: "4",
    name: "Component 4",
    code: "Initial description",
    description: "Initial description about Standards and Interoperability",
    assessmentId: "assessment-124",
    domainId: "domain-124",
  },
];

export function ComponentsTab() {
  const [activeComponent, setActiveComponent] =
    useState<AssessmentComponent | null>(components[0] ?? null);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar<AssessmentComponent>
        list={components}
        activeItem={activeComponent}
        onItemSelect={setActiveComponent}
        groupByKey="domainId"
        displayKey="name"
      />
      <Content activeComponent={activeComponent} />
    </div>
  );
}

export default ComponentsTab;
