"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Content } from "./components/Content";
import type { Component as SubComponent } from "../../../types/index";

//TODO Replace with real data
const subComponents: SubComponent[] = [
  {
    id: "1",
    name: "SubComponent 1",
    code: "Initial description",
    description: "Initial description about Leadership and Governance",
  },
  {
    id: "2",
    name: "SubComponent 2",
    code: "Initial description",
    description: "Initial description about Management and Workforce",
  },
  {
    id: "3",
    name: "SubComponent 3",
    code: "Initial description",
    description: "Initial description about ICT Infrastructure",
  },
  {
    id: "4",
    name: "SubComponent 4",
    code: "Initial description",
    description: "Initial description about Standards and Interoperability",
  },
];

export function SubSubComponents() {
  const [activeSubComponent, setActiveSubComponent] =
    useState<SubComponent | null>(subComponents[0] ?? null);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar
        subComponents={subComponents}
        activeSubComponent={activeSubComponent}
        onSubComponentSelect={setActiveSubComponent}
      />
      <Content activeSubComponent={activeSubComponent} />
    </div>
  );
}

export default SubSubComponents;
