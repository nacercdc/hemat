import React from "react";
import { Icon } from "@iconify/react";
import { DomainCard } from "./DomainCard";

//Dummy domain scores interface
interface DomainScore {
  name: string;
  result: number;
  type: "single" | "summary";
  icon?: React.ReactNode;
}
//Dummy domain scores data
const domainScores: DomainScore[] = [
  { name: "OverAll", result: 3, type: "summary" },
  {
    name: "Leadership and Governance",
    result: 4,
    type: "single",
    icon: <Icon icon="fluent-mdl2:party-leader" />,
  },
  {
    name: "Information and Communication Technology (ICT) Infrastructure",
    result: 2,
    type: "single",
    icon: <Icon icon="game-icons:satellite-communication" />,
  },
  {
    name: "Standards and Interoperability",
    result: 5,
    type: "single",
    icon: <Icon icon="carbon:ibm-knowledge-catalog-standard" />,
  },
  {
    name: "Management and Workspace",
    result: 3,
    type: "single",
    icon: <Icon icon="fluent-mdl2:workforce-management" />,
  },
];

export function DomainCardList() {
  return (
    <div className="flex justify-between overflow-x-auto">
      {domainScores.map(({ name, result, type, icon }) => (
        <DomainCard
          key={name}
          icon={icon}
          title={name}
          domainType={type}
          result={result}
        />
      ))}
    </div>
  );
}
