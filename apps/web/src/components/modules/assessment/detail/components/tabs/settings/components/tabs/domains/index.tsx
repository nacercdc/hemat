"use client";

import { useState } from "react";

import { Content } from "./components/Content";
import type { AssessmentDomain } from "../../../types/index";
import { Sidebar } from "../../Sidebar";

//TODO Replace with real data
const domains: AssessmentDomain[] = [
  {
    id: "1",
    name: "Domain 1",
    code: "Initial description",
    description: "Initial description about Leadership and Governance",
    assessmentId: "assessment-123",
  },
  {
    id: "2",
    name: "Domain 2",
    code: "Initial description",
    description: "Initial description about Management and Workforce",
    assessmentId: "assessment-123",
  },
  {
    id: "3",
    name: "Domain 3",
    code: "Initial description",
    description: "Initial description about ICT Infrastructure",
    assessmentId: "assessment-124",
  },
  {
    id: "4",
    name: "Domain 4",
    code: "Initial description",
    description: "Initial description about Standards and Interoperability",
    assessmentId: "assessment-124",
  },
];

export function Domain() {
  const [activeDomain, setActiveDomain] = useState<AssessmentDomain | null>(
    domains[0] ?? null
  );

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar<AssessmentDomain>
        list={domains}
        activeItem={activeDomain}
        onItemSelect={setActiveDomain}
        displayKey="name"
      />
      <Content activeDomain={activeDomain} />
    </div>
  );
}

export default Domain;
