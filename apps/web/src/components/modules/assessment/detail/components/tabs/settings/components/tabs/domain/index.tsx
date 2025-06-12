"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Content } from "./components/Content";
import type { Domain } from "../../../types/index";

//TODO Replace with real data
const domains: Domain[] = [
  {
    id: "1",
    name: "dsdsds",
    code: "Initial description",
    description: "Initial description about Leadership and Governance",
  },
  {
    id: "2",
    name: "dsdsdsds",
    code: "Initial description",
    description: "Initial description about Management and Workforce",
  },
  {
    id: "3",
    name: "Initial description",
    code: "Initial description",
    description: "Initial description about ICT Infrastructure",
  },
  {
    id: "4",
    name: "sdsd",
    code: "Initial description",
    description: "Initial description about Standards and Interoperability",
  },
];

export function Domain() {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(
    domains[0] ?? null
  );

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar
        domains={domains}
        activeDomain={activeDomain}
        onDomainSelect={setActiveDomain}
      />
      <Content activeDomain={activeDomain} />
    </div>
  );
}

export default Domain;
