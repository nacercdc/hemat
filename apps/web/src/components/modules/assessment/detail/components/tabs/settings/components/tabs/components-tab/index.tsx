"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Content } from "./components/Content";
import type { Component } from "../../../types/index";

//TODO Replace with real data
const components: Component[] = [
  {
    id: "1",
    name: "Component 1",
    code: "Initial description",
    description: "Initial description about Leadership and Governance",
  },
  {
    id: "2",
    name: "Component 2",
    code: "Initial description",
    description: "Initial description about Management and Workforce",
  },
  {
    id: "3",
    name: "Component 3",
    code: "Initial description",
    description: "Initial description about ICT Infrastructure",
  },
  {
    id: "4",
    name: "Component 4",
    code: "Initial description",
    description: "Initial description about Standards and Interoperability",
  },
];

export function ComponentsTab() {
  const [activeComponent, setActiveComponent] = useState<Component | null>(
    components[0] ?? null
  );

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar
        components={components}
        activeComponent={activeComponent}
        onComponentSelect={setActiveComponent}
      />
      <Content activeComponent={activeComponent} />
    </div>
  );
}

export default ComponentsTab;
